# Historia de Cambios y Registro del Proyecto

## [2026-07-24] Configuración del Pipeline de Integración Continua (Sección 7 - `.gitlab-ci.yml`)
- Se creó el archivo de pipeline [`.gitlab-ci.yml`](file:///home/eabol/coding/travel-management/.gitlab-ci.yml) en la raíz del monorepo respondiendo a los requerimientos de la Sección 7 de [`main-reqs.md`](file:///home/eabol/coding/travel-management/docs/main-reqs.md).
- Definidas las 3 etapas (*stages*) obligatorias:
  1. **`lint/test`**: Ejecuta las suites de pruebas unitarias/integración en backend (`npm run test:run`) y frontend (`npm run test:unit -- --run`). **Bloquea el pipeline de forma obligatoria si falla algún test.**
  2. **`build`**: Construye las imágenes Docker optimizadas para producción usando `backend/Dockerfile.prod` y `frontend/Dockerfile.prod`.
  3. **`deploy`**: Ejecuta el script simulado de despliegue con la combinación `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-build`.
- Se redactó el documento ADR [`docs/adrs/005-gitlab-ci-cd-pipeline.md`](file:///home/eabol/coding/travel-management/docs/adrs/005-gitlab-ci-cd-pipeline.md).

## [2026-07-24] Implementación de Reglas de Negocio RBAC (Sección 6) con TDD
- Se revisaron los requerimientos del documento [`main-reqs.md`](file:///home/eabol/coding/travel-management/docs/main-reqs.md) Sección 6.
- Se implementó la función `updateTravelExpense` en [`backend/src/api/expenses/controller.ts`](file:///home/eabol/coding/travel-management/backend/src/api/expenses/controller.ts).
- Se re-validó la suite de pruebas del backend alcanzando **19/19 pruebas en verde**.

## [2026-07-24] Creación de Registros de Decisiones de Arquitectura (ADRs)
- Se redactaron los documentos ADR en el directorio [`docs/adrs/`](file:///home/eabol/coding/travel-management/docs/adrs).
