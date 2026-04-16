# Frontend - Angular

Interfaz web en Angular para consumir la API REST de tareas.

## Requisitos

- Node.js 18 o superior

## Configuracion

La API usada por el frontend es:

```text
http://localhost:8080/api
```

La URL esta definida en `src/app/services/tareas.service.ts`.

## Ejecutar

```bash
npm install
npm start
```

En PowerShell, si `npm` esta bloqueado por la politica de scripts, usa:

```bash
npm.cmd install
npm.cmd start
```

El frontend queda disponible en:

```text
http://localhost:4200
```

## Build

```bash
npm run build
```
