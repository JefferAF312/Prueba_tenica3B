# Prueba tecnica 3B
## Estructura

```text
backend/
frontend/
```

## Backend

```bash
cd backend
mvn spring-boot:run
```

API:

```text
http://localhost:8080/api
```

Persistencia:

```text
backend/data/tareas.json
```

## Frontend

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

## Manejo de errores

El backend responde con codigos HTTP adecuados:

- `200` para operaciones correctas
- `201` al crear tareas
- `204` al eliminar tareas
- `400` para validaciones o datos invalidos
- `404` cuando una tarea no existe
- `500` para errores internos

## Nota

Ya que no cuenta con base de datos se utilizará un .json como base de datos para guardar las tareas. (tareas.json)
