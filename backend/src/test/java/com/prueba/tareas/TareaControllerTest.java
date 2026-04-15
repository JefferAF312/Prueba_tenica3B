package com.prueba.tareas;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import com.prueba.tareas.repository.TareaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class TareaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TareaRepository tareaRepository;

    @BeforeEach
    void limpiar() {
        tareaRepository.deleteAll();
    }

    @Test
    void permiteCrearListarActualizarYEliminar() throws Exception {
        Long id = crearTarea();

        mockMvc.perform(get("/tareas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        mockMvc.perform(put("/tareas/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "estado": "COMPLETADA"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("COMPLETADA"));

        mockMvc.perform(delete("/tareas/" + id))
                .andExpect(status().isNoContent());
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
                                  "estado": "EN_PROCESO"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Estado invalido. Usa PENDIENTE o COMPLETADA"));
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
