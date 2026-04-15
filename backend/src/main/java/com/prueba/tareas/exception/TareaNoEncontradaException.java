package com.prueba.tareas.exception;

public class TareaNoEncontradaException extends RuntimeException {

    public TareaNoEncontradaException(Long id) {
        super("No existe una tarea con id " + id);
    }
}
