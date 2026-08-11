## [2026-07-25] Corrección de Errores de Compilación TypeScript en Backend (`npm run build`)
- Se instaló `@types/pg` en las dependencias de desarrollo del backend.
- Se configuraron los patrones `include` y `exclude` en [`backend/tsconfig.json`](file:///home/eabol/coding/travel-management/backend/tsconfig.json) para aislar los archivos fuera de `src/` durante el build.
- Se corrigieron errores estrictos de tipos en [`backend/src/bin/www.ts`](file:///home/eabol/coding/travel-management/backend/src/bin/www.ts) (`PORT` parseado a número), [`backend/src/middleware/auth.ts`](file:///home/eabol/coding/travel-management/backend/src/middleware/auth.ts) (verificación de token no definido) y [`backend/src/api/expenses/controller.ts`](file:///home/eabol/coding/travel-management/backend/src/api/expenses/controller.ts) (encadenamiento opcional en errores de validación de Joi).

## [2026-07-24] Documentación Global y Diagrama de Arquitectura Mermaid (`README.md`)
- Se redactó el documento principal del proyecto [`README.md`](file:///home/eabol/coding/travel-management/README.md).
- Se elaboró el diagrama interactivo de arquitectura e infraestructura con sintaxis **Mermaid**, detallando la Capa Cliente (Vue 3 MD3), Proxy Reverso de Ingress, Servidor Backend (Node Express con Middlewares de JWT, Helmet y RateLimit), la Base de Datos PostgreSQL 15 (esquema `travel_db`) y el flujo del Pipeline GitLab CI/CD.
- Se agregaron instrucciones de inicio rápido, tabla de credenciales semilla por defecto, comandos de ejecución de pruebas TDD y enlaces a los 5 ADRs del proyecto.

## [2026-07-24] Creación de Colección de Postman v2.1.0 para Pruebas de API
- Se generó el archivo [`docs/postman_collection.json`](file:///home/eabol/coding/travel-management/docs/postman_collection.json) conteniendo la colección completa de peticiones HTTP en formato Postman v2.1.0.

## [2026-07-24] Configuración del Pipeline de Integración Continua (Sección 7 - `.gitlab-ci.yml`)
- Se creó el archivo de pipeline [`.gitlab-ci.yml`](file:///home/eabol/coding/travel-management/.gitlab-ci.yml) definiendo las 3 etapas (*stages*) obligatorias: `lint/test`, `build` y `deploy`.
- Se redactó el documento ADR [`docs/adrs/005-gitlab-ci-cd-pipeline.md`](file:///home/eabol/coding/travel-management/docs/adrs/005-gitlab-ci-cd-pipeline.md).

## [2026-07-24] Implementación de Reglas de Negocio RBAC (Sección 6) con TDD
- Se implementó la función `updateTravelExpense` en [`backend/src/api/expenses/controller.ts`](file:///home/eabol/coding/travel-management/backend/src/api/expenses/controller.ts).
- Se re-validó la suite de pruebas del backend alcanzando **19/19 pruebas en verde**.
