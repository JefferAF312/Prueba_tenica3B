# Prueba tecnica 3B

Proyecto completo de gestion de tareas con:

- Backend: Java, Spring Boot, PostgreSQL y PL/pgSQL.
- Frontend web: Angular.

## Estructura

```text
backend/
frontend/
```

## Backend

```bash
cd backend
docker compose up -d
mvn spring-boot:run
```

API:

```text
http://localhost:8080/api
```

La migracion de base de datos esta en:

```text
backend/src/main/resources/db/migration/V1__crear_tabla_tareas.sql
```

## Frontend Angular

```bash
cd frontend
npm install
npm start
```

URL:

```text
http://localhost:4200
```

## Verificacion

```bash
cd backend
mvn test

cd ../frontend
npm run build
```
