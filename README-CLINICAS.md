# Clínicas Land

Plataforma para gestión de formularios de clínicas médicas utilizando React, TypeScript y Vite.

## Características

- Login de usuario seguro
- Landing page para recepción de formularios de clínicas
- URLs dinámicas para cada clínica asociada
- Validación de formularios
- Diseño responsive y accesible

## URLs Dinámicas

El proyecto permite URLs dinámicas para identificar diferentes clínicas. Estas URLs tienen la estructura:

```
/register-patients/:clinicId
```

Donde `:clinicId` debe ser uno de los valores permitidos definidos en el objeto `ALLOWED_CLINICS` en `src/App.tsx`.

### Clínicas permitidas actualmente:

- `/register-patients/virtualdent` - Para la clínica VirtualDent
- `/register-patients/oftalmomedic` - Para la clínica Oftalmomedic

Si se intenta acceder con un ID de clínica no válido, el usuario será redirigido a la página de login.

## Variables de Entorno

Para configurar el endpoint de envío de formularios, crea un archivo `.env` basado en `.env.example` con la siguiente variable:

```
VITE_API_ENDPOINT_FORM=https://tu-api.com/endpoint
```

## Instalación

1. Clona el repositorio
2. Instala las dependencias: `npm install`
3. Crea un archivo `.env` con la configuración necesaria
4. Ejecuta el servidor de desarrollo: `npm run dev`

## Despliegue

Para construir la aplicación para producción:

```
npm run build
```

Los archivos generados estarán en el directorio `dist/`.