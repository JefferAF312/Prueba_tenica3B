import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ActualizarTareaRequest, CrearTareaRequest, Tarea } from '../models/tarea';

@Injectable({ providedIn: 'root' })
export class TareasService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/tareas';

  listar(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl);
  }

  obtener(id: number): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.apiUrl}/${id}`);
  }

  crear(request: CrearTareaRequest): Observable<Tarea> {
    return this.http.post<Tarea>(this.apiUrl, request);
  }

  actualizar(id: number, request: ActualizarTareaRequest): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.apiUrl}/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
