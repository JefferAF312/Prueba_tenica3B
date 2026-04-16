package com.prueba.tareas.dto;

public record ActualizarTareaRequest(
        String titulo,
        String descripcion,
        String estado
) {
}
