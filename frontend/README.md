# Frontend - Gestion de tareas
## Requisitos

- Node.js 18 o superior

## Configuracion

La API por defecto es:

```text
http://localhost:8080/api
```

Si necesitas cambiarla, crea un archivo `.env` copiando `.env.example`:

```bash
VITE_API_URL=http://localhost:8080/api
```

## Ejecutar

```bash
npm install
npm run dev
```

En PowerShell, si `npm` esta bloqueado por la politica de scripts, usa:

```bash
npm.cmd install
npm.cmd run dev
```

El frontend queda disponible en:

```text
http://127.0.0.1:5173
```

## Build

```bash
npm run build
```
