# Prueba tecnica 3B

Proyecto completo de gestion de tareas con:

- Backend: Java, Spring Boot, PostgreSQL y PL/pgSQL.
- Frontend web: Angular.
- Mobile: React Native con Expo.

## Estructura

```text
backend/
frontend/
mobile/
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

## Mobile React Native

```bash
cd mobile
npm install
npm start
```

Para Android Emulator:

```powershell
$env:EXPO_PUBLIC_API_URL="http://10.0.2.2:8080/api"
```

Para telefono fisico, usa la IP local de tu PC:

```powershell
$env:EXPO_PUBLIC_API_URL="http://TU_IP_LOCAL:8080/api"
```

## Verificacion

```bash
cd backend
mvn test

cd ../frontend
npm run build

cd ../mobile
npx tsc --noEmit
```
