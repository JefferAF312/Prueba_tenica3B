# Frontend - Angular

Frontend web en Angular para consumir la API Spring de tareas.

## Requisitos

- Node.js 20 o superior
- Backend corriendo en `http://localhost:8080/api`

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

La aplicacion queda disponible en:

```text
http://localhost:4200
```

## Build

```bash
npm run build
```

O en PowerShell:

```bash
npm.cmd run build
```

## API

El servicio Angular apunta a:

```text
http://localhost:8080/api/tareas
```

Archivo principal:

```text
src/app/tareas.service.ts
```
