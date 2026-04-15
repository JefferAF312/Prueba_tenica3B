package com.prueba.tareas.dto;

import jakarta.validation.constraints.NotBlank;

public record CrearTareaRequest(
        @NotBlank(message = "El titulo no puede estar vacio")
        String titulo,
        String descripcion,
        String estado
) {
}
