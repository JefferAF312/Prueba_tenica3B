import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrearTareaRequest, EstadoTarea, Tarea } from './models/tarea';
import { TareasService } from './services/tareas.service';

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
  readonly tareaEnEdicion = signal<Tarea | null>(null);
  readonly contador = computed(() => {
    const total = this.tareas().length;
    return `${total} ${total === 1 ? 'tarea' : 'tareas'}`;
  });
  readonly tituloFormulario = computed(() => (this.tareaEnEdicion() ? 'Editar tarea' : 'Nueva tarea'));
  readonly textoBotonPrincipal = computed(() => (this.tareaEnEdicion() ? 'Guardar' : 'Crear'));

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

  guardarTarea(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mostrarMensaje('El titulo es obligatorio', 'error');
      return;
    }

    const request = this.obtenerRequestDesdeFormulario();
    const tareaEnEdicion = this.tareaEnEdicion();
    this.cargando.set(true);

    const solicitud = tareaEnEdicion
      ? this.tareasService.actualizar(tareaEnEdicion.id, request)
      : this.tareasService.crear(request);

    solicitud.subscribe({
      next: () => {
        this.reiniciarFormulario();
        this.mostrarMensaje(tareaEnEdicion ? 'Tarea actualizada' : 'Tarea creada', 'success');
        this.cargarTareas();
      },
      error: (error) => this.mostrarError(error),
    });
  }

  editarTarea(tarea: Tarea): void {
    this.tareaEnEdicion.set(tarea);
    this.form.setValue({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion ?? '',
      estado: tarea.estado,
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.mostrarMensaje('', '');
  }

  cancelarEdicion(): void {
    this.reiniciarFormulario();
    this.mostrarMensaje('', '');
  }

  cambiarEstado(tarea: Tarea): void {
    const nuevoEstado: EstadoTarea = tarea.estado === 'PENDIENTE' ? 'COMPLETADA' : 'PENDIENTE';
    this.cargando.set(true);

    this.tareasService
      .actualizar(tarea.id, {
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        estado: nuevoEstado,
      })
      .subscribe({
        next: (tareaActualizada) => {
          if (this.tareaEnEdicion()?.id === tarea.id) {
            this.tareaEnEdicion.set(tareaActualizada);
            this.form.patchValue({ estado: tareaActualizada.estado });
          }
          this.mostrarMensaje('Estado actualizado', 'success');
          this.cargarTareas();
        },
        error: (error) => this.mostrarError(error),
      });
  }

  eliminarTarea(tarea: Tarea): void {
    const confirmar = window.confirm(`¿Seguro que deseas eliminar la tarea "${tarea.titulo}"?`);
    if (!confirmar) {
      return;
    }

    this.cargando.set(true);

    this.tareasService.eliminar(tarea.id).subscribe({
      next: () => {
        if (this.tareaEnEdicion()?.id === tarea.id) {
          this.reiniciarFormulario();
        }
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

  private mostrarMensaje(texto: string, tipo: 'success' | 'error' | ''): void {
    this.mensaje.set(texto);
    this.tipoMensaje.set(tipo);
  }

  private obtenerRequestDesdeFormulario(): CrearTareaRequest {
    const valor = this.form.getRawValue();
    return {
      titulo: valor.titulo.trim(),
      descripcion: valor.descripcion.trim() || null,
      estado: valor.estado,
    };
  }

  private reiniciarFormulario(): void {
    this.tareaEnEdicion.set(null);
    this.form.reset({ titulo: '', descripcion: '', estado: 'PENDIENTE' });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private mostrarError(error: { error?: { message?: string }; message?: string }): void {
    this.cargando.set(false);
    this.mostrarMensaje(error.error?.message || error.message || 'No se pudo completar la operacion', 'error');
  }
}
