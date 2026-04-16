package com.prueba.tareas.storage;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prueba.tareas.model.Tarea;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class TareaJsonStorage {

    private static final TypeReference<List<Tarea>> TAREAS_TYPE = new TypeReference<>() {
    };

    private final ObjectMapper objectMapper;
    private final Path storagePath;

    public TareaJsonStorage(
            ObjectMapper objectMapper,
            @Value("${tareas.storage.path:data/tareas.json}") String storagePath) {
        this.objectMapper = objectMapper;
        this.storagePath = Path.of(storagePath).toAbsolutePath().normalize();
    }

    public List<Tarea> cargar() {
        Path archivo = asegurarArchivo();

        try {
            String contenido = Files.readString(archivo, StandardCharsets.UTF_8);
            if (contenido.isBlank()) {
                return List.of();
            }

            return objectMapper.readValue(contenido, TAREAS_TYPE);
        } catch (IOException ex) {
            throw new IllegalStateException("No se pudo leer el archivo de tareas JSON", ex);
        }
    }

    public void guardar(List<Tarea> tareas) {
        Path archivo = asegurarArchivo();

        try {
            String contenido = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(tareas);
            Files.writeString(archivo, contenido, StandardCharsets.UTF_8);
        } catch (IOException ex) {
            throw new IllegalStateException("No se pudo guardar el archivo de tareas JSON", ex);
        }
    }

    private Path asegurarArchivo() {
        try {
            Path carpeta = storagePath.getParent();
            if (carpeta != null) {
                Files.createDirectories(carpeta);
            }

            if (Files.notExists(storagePath)) {
                Files.writeString(storagePath, "[]", StandardCharsets.UTF_8);
            }

            return storagePath;
        } catch (IOException ex) {
            throw new IllegalStateException("No se pudo preparar el archivo de tareas JSON", ex);
        }
    }
}
