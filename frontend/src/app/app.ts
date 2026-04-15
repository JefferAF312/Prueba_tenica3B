import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstadoTarea, Tarea } from './tarea';
import { TareasService } from './tareas.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly tareasService = inject(TareasService);
  private readonly fb = inject(FormBuilder);

  readonly tareas = signal<Tarea[]>([]);
  readonly cargando = signal(false);
  readonly mensaje = signal('');
  readonly tipoMensaje = signal<'success' | 'error' | ''>('');
  readonly contador = computed(() => {
    const total = this.tareas().length;
    return `${total} ${total === 1 ? 'tarea' : 'tareas'}`;
  });

  readonly form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(120)]],
    descripcion: ['', [Validators.maxLength(500)]],
    estado: ['PENDIENTE' as EstadoTarea, [Validators.required]],
  });

  ngOnInit(): void {
    this.cargarTareas();
  }

  cargarTareas(): void {
    this.cargando.set(true);
    this.tareasService.listar().subscribe({
      next: (tareas) => {
        this.tareas.set(tareas);
        this.cargando.set(false);
        if (!this.mensaje()) {
          this.tipoMensaje.set('');
        }
      },
      error: (error) => this.mostrarError(error),
    });
  }

  crearTarea(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mostrarMensaje('El titulo es obligatorio', 'error');
      return;
    }

    const valor = this.form.getRawValue();
    this.cargando.set(true);

    this.tareasService
      .crear({
        titulo: valor.titulo.trim(),
        descripcion: valor.descripcion.trim() || null,
        estado: valor.estado,
      })
      .subscribe({
        next: () => {
          this.form.reset({ titulo: '', descripcion: '', estado: 'PENDIENTE' });
          this.mostrarMensaje('Tarea creada', 'success');
          this.cargarTareas();
        },
        error: (error) => this.mostrarError(error),
      });
  }

  cambiarEstado(tarea: Tarea): void {
    const nuevoEstado: EstadoTarea = tarea.estado === 'PENDIENTE' ? 'COMPLETADA' : 'PENDIENTE';
    this.cargando.set(true);

    this.tareasService.actualizarEstado(tarea.id, nuevoEstado).subscribe({
      next: () => {
        this.mostrarMensaje('Estado actualizado', 'success');
        this.cargarTareas();
      },
      error: (error) => this.mostrarError(error),
    });
  }

  eliminarTarea(tarea: Tarea): void {
    this.cargando.set(true);

    this.tareasService.eliminar(tarea.id).subscribe({
      next: () => {
        this.mostrarMensaje('Tarea eliminada', 'success');
        this.cargarTareas();
      },
      error: (error) => this.mostrarError(error),
    });
  }

  formatearFecha(valor: string): string {
    return new Intl.DateTimeFormat('es-BO', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(valor));
  }

  trackById(_: number, tarea: Tarea): number {
    return tarea.id;
  }

  private mostrarMensaje(texto: string, tipo: 'success' | 'error'): void {
    this.mensaje.set(texto);
    this.tipoMensaje.set(tipo);
  }

  private mostrarError(error: { error?: { message?: string }; message?: string }): void {
    this.cargando.set(false);
    this.mostrarMensaje(error.error?.message || error.message || 'No se pudo completar la operacion', 'error');
  }
}
