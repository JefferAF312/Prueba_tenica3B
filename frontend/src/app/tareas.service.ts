import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearTareaRequest, EstadoTarea, Tarea } from './tarea';

@Injectable({ providedIn: 'root' })
export class TareasService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/tareas';

  listar(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl);
  }

  crear(request: CrearTareaRequest): Observable<Tarea> {
    return this.http.post<Tarea>(this.apiUrl, request);
  }

  actualizarEstado(id: number, estado: EstadoTarea): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.apiUrl}/${id}`, { estado });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
