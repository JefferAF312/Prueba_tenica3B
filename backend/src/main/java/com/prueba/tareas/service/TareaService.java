package com.prueba.tareas.service;

import com.prueba.tareas.dto.ActualizarTareaRequest;
import com.prueba.tareas.dto.CrearTareaRequest;
import com.prueba.tareas.dto.TareaResponse;
import com.prueba.tareas.exception.TareaNoEncontradaException;
import com.prueba.tareas.model.EstadoTarea;
import com.prueba.tareas.model.Tarea;
import com.prueba.tareas.storage.TareaJsonStorage;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Service;

@Service
public class TareaService {

    private final Map<Long, Tarea> tareas = new ConcurrentHashMap<>();
    private final AtomicLong secuencia = new AtomicLong(0);
    private final TareaJsonStorage storage;

    public TareaService(TareaJsonStorage storage) {
        this.storage = storage;
        cargarTareas();
    }

    public synchronized List<TareaResponse> listar() {
        return tareasOrdenadas()
                .stream()
                .map(TareaResponse::from)
                .toList();
    }

    public synchronized TareaResponse obtener(Long id) {
        return TareaResponse.from(buscarPorId(id));
    }

    public synchronized TareaResponse crear(CrearTareaRequest request) {
        LocalDateTime ahora = LocalDateTime.now();
        Tarea tarea = new Tarea();
        tarea.setId(secuencia.incrementAndGet());
        tarea.setTitulo(request.titulo().trim());
        tarea.setDescripcion(limpiar(request.descripcion()));
        tarea.setEstado(EstadoTarea.desdeOpcional(request.estado()));
        tarea.setFechaCreacion(ahora);
        tarea.setFechaActualizacion(ahora);

        tareas.put(tarea.getId(), tarea);
        persistir();
        return TareaResponse.from(tarea);
    }

    public synchronized TareaResponse actualizar(Long id, ActualizarTareaRequest request) {
        Tarea tarea = buscarPorId(id);
        if (request.titulo() != null) {
            String titulo = request.titulo().trim();
            if (titulo.isBlank()) {
                throw new IllegalArgumentException("El titulo no puede estar vacio");
            }
            tarea.setTitulo(titulo);
            tarea.setDescripcion(limpiar(request.descripcion()));
        }

        if (request.titulo() == null && request.descripcion() != null) {
            tarea.setDescripcion(limpiar(request.descripcion()));
        }

        tarea.setEstado(EstadoTarea.desdeRequerido(request.estado()));
        tarea.setFechaActualizacion(LocalDateTime.now());

        persistir();
        return TareaResponse.from(tarea);
    }

    public synchronized void eliminar(Long id) {
        if (tareas.remove(id) == null) {
            throw new TareaNoEncontradaException(id);
        }

        persistir();
    }

    private Tarea buscarPorId(Long id) {
        Tarea tarea = tareas.get(id);
        if (tarea == null) {
            throw new TareaNoEncontradaException(id);
        }

        return tarea;
    }

    private String limpiar(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }

        return valor.trim();
    }

    public synchronized void reiniciar() {
        tareas.clear();
        secuencia.set(0);
        persistir();
    }

    private void cargarTareas() {
        List<Tarea> cargadas = storage.cargar();
        for (Tarea tarea : cargadas) {
            if (tarea.getId() != null) {
                tareas.put(tarea.getId(), tarea);
            }
        }

        long ultimoId = cargadas.stream()
                .map(Tarea::getId)
                .filter(Objects::nonNull)
                .mapToLong(Long::longValue)
                .max()
                .orElse(0L);

        secuencia.set(ultimoId);
    }

    private void persistir() {
        storage.guardar(tareasOrdenadas());
    }

    private List<Tarea> tareasOrdenadas() {
        return tareas.values()
                .stream()
                .sorted(Comparator.comparing(Tarea::getId))
                .toList();
    }
}
