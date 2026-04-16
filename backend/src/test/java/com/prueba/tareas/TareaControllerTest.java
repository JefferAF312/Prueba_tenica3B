package com.prueba.tareas;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.assertj.core.api.Assertions.assertThat;

import com.jayway.jsonpath.JsonPath;
import com.prueba.tareas.service.TareaService;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = "tareas.storage.path=target/test-data/tareas-test.json")
class TareaControllerTest {

    private static final Path TEST_STORAGE_PATH = Path.of("target", "test-data", "tareas-test.json");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TareaService tareaService;

    @BeforeEach
    void limpiar() {
        tareaService.reiniciar();
    }

    @Test
    void permiteCrearListarActualizarYEliminar() throws Exception {
        Long id = crearTarea();

        mockMvc.perform(get("/tareas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        mockMvc.perform(get("/tareas/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.titulo").value("Preparar prueba"));

        mockMvc.perform(put("/tareas/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "estado": "COMPLETADA"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo").value("Preparar prueba"))
                .andExpect(jsonPath("$.descripcion").value("Backend y frontend"))
                .andExpect(jsonPath("$.estado").value("COMPLETADA"));

        mockMvc.perform(delete("/tareas/" + id))
                .andExpect(status().isNoContent());
    }

    @Test
    void permiteActualizarLaTareaCompleta() throws Exception {
        Long id = crearTarea();

        mockMvc.perform(put("/tareas/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "titulo": "Preparar prueba final",
                                  "descripcion": "Backend, frontend y JSON",
                                  "estado": "COMPLETADA"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo").value("Preparar prueba final"))
                .andExpect(jsonPath("$.descripcion").value("Backend, frontend y JSON"))
                .andExpect(jsonPath("$.estado").value("COMPLETADA"));
    }

    @Test
    void validaTituloYEstado() throws Exception {
        mockMvc.perform(post("/tareas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "titulo": "",
                                  "estado": "PENDIENTE"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("El titulo no puede estar vacio"));

        Long id = crearTarea();

        mockMvc.perform(put("/tareas/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "titulo": "",
                                  "estado": "PENDIENTE"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("El titulo no puede estar vacio"));

        mockMvc.perform(put("/tareas/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "estado": "EN_PROCESO"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Estado invalido. Usa PENDIENTE o COMPLETADA"));
    }

    @Test
    void retorna404CuandoLaTareaNoExiste() throws Exception {
        mockMvc.perform(delete("/tareas/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No existe una tarea con id 999"));
    }

    @Test
    void guardaLasTareasEnJson() throws Exception {
        crearTarea();

        String contenido = Files.readString(TEST_STORAGE_PATH);

        assertThat(contenido).contains("Preparar prueba");
        assertThat(contenido).contains("\"estado\" : \"PENDIENTE\"");
    }

    private Long crearTarea() throws Exception {
        String creada = mockMvc.perform(post("/tareas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "titulo": "Preparar prueba",
                                  "descripcion": "Backend y frontend",
                                  "estado": "PENDIENTE"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.titulo").value("Preparar prueba"))
                .andExpect(jsonPath("$.estado").value("PENDIENTE"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Number id = JsonPath.read(creada, "$.id");
        return id.longValue();
    }
}
