# ADR 004: Documentación API Design-First con OpenAPI 3.0 y Swagger UI

## Estado
Aprobado

## Contexto
Para garantizar la mantenibilidad del backend y facilitar el consumo de los endpoints tanto de la API Externa Mock como de la API Interna de Viáticos, se necesitaba una especificación viva, interactiva y estandarizada.

## Decisión
Se decidió integrar **OpenAPI 3.0** utilizando las librerías `swagger-jsdoc` y `swagger-ui-express` en la aplicación Express:
- La configuración global habita en `backend/src/config/swagger.ts`.
- La documentación de cada endpoint se realiza mediante comentarios JSDoc `@openapi` co-localizados en los archivos de rutas (`routes.ts`) de cada módulo.
- Se configuró el esquema de seguridad `bearerAuth` para permitir probar la autenticación por token JWT directamente desde la interfaz web de Swagger.
- La interfaz interactiva se expone en las rutas `/docs` y `/api-docs`.

## Consecuencias
### Positivas
- Documentación de API siempre actualizada al estar co-localizada con el código fuente de las rutas.
- Interfaz interactiva que permite a desarrolladores y auditores probar las peticiones HTTP directamente en el navegador.
- Estandarización bajo la especificación internacional OpenAPI 3.0.
### Negativas
- Incremento ligero en el peso de las dependencias del backend.
