package com.prueba.tareas.controller;

import com.prueba.tareas.dto.ActualizarTareaRequest;
import com.prueba.tareas.dto.CrearTareaRequest;
import com.prueba.tareas.dto.TareaResponse;
import com.prueba.tareas.service.TareaService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tareas")
public class TareaController {

    private final TareaService tareaService;

    public TareaController(TareaService tareaService) {
        this.tareaService = tareaService;
    }

    @GetMapping
    public List<TareaResponse> listar() {
        return tareaService.listar();
    }

    @GetMapping("/{id}")
    public TareaResponse obtener(@PathVariable Long id) {
        return tareaService.obtener(id);
    }

    @PostMapping
    public ResponseEntity<TareaResponse> crear(@Valid @RequestBody CrearTareaRequest request) {
        TareaResponse tarea = tareaService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(tarea);
    }

    @PutMapping("/{id}")
    public TareaResponse actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarTareaRequest request) {
        return tareaService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tareaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
