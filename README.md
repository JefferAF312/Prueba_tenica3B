# Prueba tecnica 3B

Proyecto completo de gestion de tareas con:

- Backend: Java y Spring Boot.
- Frontend web: Angular.

## Estructura

```text
backend/
frontend/
```

## Backend

```bash (cmd)
cd backend
mvn spring-boot:run
```

API:

```text
http://localhost:8080/api
```

## Frontend Angular

```bash (cmd)
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

 ## MANEJO DE ERRORES SE REALIZA EN CONTROLLER Y EXEPTION 
 AL NO ESTAR CONECTADA A UNA BASE DE DATOS ES COMPLICADO VER ESOS ERRORES
 ## UTILICÉ UN .JSON PARA GUARDAR LOS DATOS INGRESADOS Y AGREGUE CRUD PARA MANEJAR MEJOR TODO LO REQUERIDO