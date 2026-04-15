export type EstadoTarea = 'PENDIENTE' | 'COMPLETADA';

export interface Tarea {
  id: number;
  titulo: string;
  descripcion: string | null;
  estado: EstadoTarea;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CrearTareaRequest {
  titulo: string;
  descripcion?: string | null;
  estado: EstadoTarea;
}
