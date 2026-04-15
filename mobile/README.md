# Mobile - React Native

Aplicacion movil simple en React Native con Expo para consumir la API Spring de tareas.

## Requisitos

- Node.js 18 o superior
- Expo Go en el telefono o un emulador Android/iOS

## Configurar API

Por defecto la app apunta a:

```text
http://localhost:8080/api
```

En Android Emulator normalmente debes usar:

```bash
$env:EXPO_PUBLIC_API_URL="http://10.0.2.2:8080/api"
```

En un telefono fisico usa la IP local de tu PC:

```bash
$env:EXPO_PUBLIC_API_URL="http://TU_IP_LOCAL:8080/api"
```

## Ejecutar

```bash
npm install
npm run android
```

Tambien puedes iniciar Expo con:

```bash
npm start
```
