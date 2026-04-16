# Backend - API REST de tareas

Backend en Java + Spring Boot para la parte 2 de la prueba tecnica. La API cumple con los endpoints solicitados en el PDF y, ademas, soporta un CRUD mas completo para el frontend.

## Requisitos

- Java 17 o superior
- Maven 3.6 o superior

## Persistencia

No usa base de datos externa. Las tareas se guardan en:

```text
backend/data/tareas.json
```

## Ejecutar

```bash
mvn spring-boot:run
```

La API queda disponible en:

```text
http://localhost:8080/api
```

## Endpoints solicitados

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| GET | `/api/tareas` | Lista todas las tareas |
| POST | `/api/tareas` | Crea una tarea |
| PUT | `/api/tareas/{id}` | Actualiza el estado de una tarea |
| DELETE | `/api/tareas/{id}` | Elimina una tarea |

## Endpoints extra

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| GET | `/api/tareas/{id}` | Obtiene una tarea por id |

El `PUT /api/tareas/{id}` acepta el formato minimo del enunciado:

```json
{
  "estado": "COMPLETADA"
}
```

Tambien acepta actualizacion completa para soportar el CRUD del frontend:

```json
{
  "titulo": "Preparar prueba final",
  "descripcion": "Backend, frontend y JSON",
  "estado": "COMPLETADA"
}
```

## Codigos HTTP

- `200`: operacion correcta
- `201`: tarea creada
- `204`: tarea eliminada
- `400`: validacion incorrecta
- `404`: tarea no encontrada
- `500`: error interno

## Probar

Puedes usar `test-endpoints.http` desde VS Code o IntelliJ, o ejecutar:

```bash
mvn test
```
