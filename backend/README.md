# Backend - API REST de tareas
## Requisitos

- Java 17 o superior
- Maven 3.6 o superior

## Base de datos

No necesitas crear una base de datos externa. El proyecto usa H2 en memoria para correr rapido.

- JDBC URL: `jdbc:h2:mem:tareas_db`
- Usuario: `sa`
- Password: vacio
- Consola H2: `http://localhost:8080/api/h2-console`

La tabla `tareas` se crea automaticamente al iniciar la API.

## Ejecutar

```bash
mvn spring-boot:run
```

## Codigos HTTP

- `200`: operacion correcta
- `201`: tarea creada
- `204`: tarea eliminada
- `400`: validacion incorrecta
- `404`: tarea no encontrada
- `500`: error interno

## Probar

Puedes usar el archivo `test-endpoints.http` desde VS Code/IntelliJ o ejecutar:

```bash
mvn test
```
