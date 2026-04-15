package com.prueba.tareas.service;

import com.prueba.tareas.dto.ActualizarEstadoRequest;
import com.prueba.tareas.dto.CrearTareaRequest;
import com.prueba.tareas.dto.TareaResponse;
import com.prueba.tareas.exception.TareaNoEncontradaException;
import com.prueba.tareas.model.EstadoTarea;
import com.prueba.tareas.model.Tarea;
import com.prueba.tareas.repository.TareaRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TareaService {

    private final TareaRepository tareaRepository;

    public TareaService(TareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
    }

    @Transactional(readOnly = true)
    public List<TareaResponse> listar() {
        return tareaRepository.findAll()
                .stream()
                .map(TareaResponse::from)
                .toList();
    }

    @Transactional
    public TareaResponse crear(CrearTareaRequest request) {
        Tarea tarea = new Tarea();
        tarea.setTitulo(request.titulo().trim());
        tarea.setDescripcion(limpiar(request.descripcion()));
        tarea.setEstado(EstadoTarea.desdeOpcional(request.estado()));

        return TareaResponse.from(tareaRepository.save(tarea));
    }

    @Transactional
    public TareaResponse actualizarEstado(Long id, ActualizarEstadoRequest request) {
        Tarea tarea = buscarPorId(id);
        tarea.setEstado(EstadoTarea.desdeRequerido(request.estado()));

        return TareaResponse.from(tareaRepository.save(tarea));
    }

    @Transactional
    public void eliminar(Long id) {
        Tarea tarea = buscarPorId(id);
        tareaRepository.delete(tarea);
    }

    private Tarea buscarPorId(Long id) {
        return tareaRepository.findById(id)
                .orElseThrow(() -> new TareaNoEncontradaException(id));
    }

    private String limpiar(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }

        return valor.trim();
    }
}
