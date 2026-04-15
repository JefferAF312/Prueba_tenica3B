# Backend - Java Spring + PostgreSQL

API REST simple para la parte 2 de la prueba tecnica. Usa Spring Boot, PostgreSQL y una migracion PL/pgSQL para crear la tabla `tareas` y actualizar automaticamente `fecha_actualizacion`.

## Requisitos

- Java 17 o superior
- Maven 3.6 o superior
- PostgreSQL 12 o superior
- Docker opcional, solo para levantar PostgreSQL rapido

## Base de datos

Configuracion por defecto:

- Database: `tareas_db`
- Usuario: `postgres`
- Password: `postgres`
- JDBC URL: `jdbc:postgresql://localhost:5432/tareas_db`

La estructura se crea con Flyway al iniciar la API:

- `src/main/resources/db/migration/V1__crear_tabla_tareas.sql`
- Incluye funcion y trigger `actualizar_fecha_tarea()` en PL/pgSQL.

## Levantar PostgreSQL con Docker

```bash
docker compose up -d
```

## Usar PostgreSQL instalado localmente

Ejecuta el archivo:

```bash
database.sql
```

O crea la base manualmente:

```sql
CREATE DATABASE tareas_db;
```

## Variables de entorno opcionales

```bash
TAREAS_DB_URL=jdbc:postgresql://localhost:5432/tareas_db
TAREAS_DB_USERNAME=postgres
TAREAS_DB_PASSWORD=postgres
```

En PowerShell:

```powershell
$env:TAREAS_DB_URL="jdbc:postgresql://localhost:5432/tareas_db"
$env:TAREAS_DB_USERNAME="postgres"
$env:TAREAS_DB_PASSWORD="postgres"
```

## Ejecutar

```bash
mvn spring-boot:run
```

La API queda disponible en:

```text
http://localhost:8080/api
```

## CORS

Habilitado para Angular en desarrollo:

- `http://localhost:4200`
- `http://127.0.0.1:4200`

## Endpoints

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| GET | `/api/tareas` | Lista todas las tareas |
| POST | `/api/tareas` | Crea una tarea |
| PUT | `/api/tareas/{id}` | Actualiza el estado |
| DELETE | `/api/tareas/{id}` | Elimina una tarea |

## Crear tarea

```http
POST /api/tareas
Content-Type: application/json

{
  "titulo": "Preparar prueba",
  "descripcion": "Terminar backend y frontend",
  "estado": "PENDIENTE"
}
```

`estado` acepta `PENDIENTE` o `COMPLETADA`. Si se omite, se guarda como `PENDIENTE`.

## Probar

```bash
mvn test
```

Tambien puedes usar `test-endpoints.http` desde VS Code o IntelliJ.
