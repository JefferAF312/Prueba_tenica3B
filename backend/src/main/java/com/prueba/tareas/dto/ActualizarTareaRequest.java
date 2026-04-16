package com.prueba.tareas.dto;

import jakarta.validation.constraints.NotBlank;

public record ActualizarTareaRequest(
        @NotBlank(message = "El titulo no puede estar vacio")
        String titulo,
        String descripcion,
        @NotBlank(message = "El estado es obligatorio")
        String estado
) {
}
