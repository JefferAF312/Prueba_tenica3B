package com.prueba.tareas.model;

public enum EstadoTarea {
    PENDIENTE,
    COMPLETADA;

    public static EstadoTarea desdeOpcional(String valor) {
        if (valor == null || valor.isBlank()) {
            return PENDIENTE;
        }

        return desdeRequerido(valor);
    }

    public static EstadoTarea desdeRequerido(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("El estado es obligatorio");
        }

        try {
            return EstadoTarea.valueOf(valor.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Estado invalido. Usa PENDIENTE o COMPLETADA");
        }
    }
}
