package com.prueba.tareas.dto;

import com.prueba.tareas.model.Tarea;
import java.time.LocalDateTime;

public record TareaResponse(
        Long id,
        String titulo,
        String descripcion,
        String estado,
        LocalDateTime fechaCreacion,
        LocalDateTime fechaActualizacion
) {

    public static TareaResponse from(Tarea tarea) {
        return new TareaResponse(
                tarea.getId(),
                tarea.getTitulo(),
                tarea.getDescripcion(),
                tarea.getEstado().name(),
                tarea.getFechaCreacion(),
                tarea.getFechaActualizacion()
        );
    }
}
