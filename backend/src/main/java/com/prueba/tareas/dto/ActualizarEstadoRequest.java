package com.prueba.tareas.dto;

import jakarta.validation.constraints.NotBlank;

public record ActualizarEstadoRequest(
        @NotBlank(message = "El estado es obligatorio")
        String estado
) {
}
