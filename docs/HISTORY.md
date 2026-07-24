# Historia de Cambios y Registro del Proyecto

## [2026-07-24] Creación de Colección de Postman v2.1.0 para Pruebas de API
- Se generó el archivo [`docs/postman_collection.json`](file:///home/eabol/coding/travel-management/docs/postman_collection.json) conteniendo la colección completa de peticiones HTTP en formato Postman v2.1.0:
  - **API Externa Mock:** Registro de usuarios, Login (con guardado automático del token JWT en la variable `{{jwtToken}}`) y envío de logs de auditoría.
  - **API Interna de Viáticos:** Creación (`POST`), edición condicional (`PUT`), listado filtrado por rol (`GET`), cambio de estado (`PATCH`) y lectura exclusiva de auditoría (`GET /audit`).
  - **Health:** Verificación de salud del servidor (`GET /health`).

## [2026-07-24] Configuración del Pipeline de Integración Continua (Sección 7 - `.gitlab-ci.yml`)
- Se creó el archivo de pipeline [`.gitlab-ci.yml`](file:///home/eabol/coding/travel-management/.gitlab-ci.yml) en la raíz del monorepo respondiendo a los requerimientos de la Sección 7 de [`main-reqs.md`](file:///home/eabol/coding/travel-management/docs/main-reqs.md).
- Definidas las 3 etapas (*stages*) obligatorias: `lint/test`, `build` y `deploy`.
- Se redactó el documento ADR [`docs/adrs/005-gitlab-ci-cd-pipeline.md`](file:///home/eabol/coding/travel-management/docs/adrs/005-gitlab-ci-cd-pipeline.md).

## [2026-07-24] Implementación de Reglas de Negocio RBAC (Sección 6) con TDD
- Se revisaron los requerimientos del documento [`main-reqs.md`](file:///home/eabol/coding/travel-management/docs/main-reqs.md) Sección 6.
- Se implementó la función `updateTravelExpense` en [`backend/src/api/expenses/controller.ts`](file:///home/eabol/coding/travel-management/backend/src/api/expenses/controller.ts).
- Se re-validó la suite de pruebas del backend alcanzando **19/19 pruebas en verde**.
