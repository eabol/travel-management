# ADR 005: Configuración del Pipeline de Integración Continua (GitLab CI/CD)

## Estado
Aprobado

## Contexto
El requerimiento 7 del proyecto especifica la necesidad de automatizar la validación, construcción y simulación de despliegue mediante un archivo de definición de integración continua `.gitlab-ci.yml`.

## Decisión
Se definió el archivo `.gitlab-ci.yml` en la raíz del repositorio estructurado en 3 etapas (*stages*):
1. **`lint/test`**: Ejecuta las suites de pruebas unitarias/integración de backend y frontend con la imagen `node:24-alpine`. Esta etapa es **bloqueante**: si algún test falla, el pipeline aborta la ejecución impidiendo el despliegue.
2. **`build`**: Construye las imágenes Docker orientadas a producción utilizando los archivos `backend/Dockerfile.prod` y `frontend/Dockerfile.prod` mediante un servicio `docker:dind` (Docker-in-Docker).
3. **`deploy`**: Simula el despliegue automático del sistema ejecutando `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-build`.

## Consecuencias
### Positivas
- Trazabilidad y aseguramiento de calidad (TDD) en cada commit/merge request.
- Prevención de despliegues con código roto gracias al bloqueo obligatorio en el stage de pruebas.
- Estandarización de artefactos listos para producción.
### Negativas
- Necesidad de un GitLab Runner habilitado con soporte Docker-in-Docker para ejecutar los stages de build y deploy.
