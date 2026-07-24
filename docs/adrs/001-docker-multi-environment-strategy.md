# ADR 001: Estrategia de Orquestación y Segmentación Multientorno con Docker

## Estado
Aprobado

## Contexto
El proyecto de Gestión de Viáticos requiere ejecutar componentes aislados (Base de Datos PostgreSQL, API Backend en Node.js y Cliente Web en Vue.js 3). Es necesario mantener configuraciones diferenciadas para entornos de Desarrollo (hot-reloading, depuración y puertos expuestos) y Producción (optimización de imágenes estáticas, seguridad y reinicio automático).

## Decisión
Se decidió utilizar **Docker Compose** con la estrategia de composición de archivos:
- `docker-compose.yml`: Define la estructura base común del servicio `db` (PostgreSQL 15-alpine) y las redes internas.
- `docker-compose.override.yml`: Aplica configuraciones exclusivas para **Desarrollo**, montando el código fuente local como volúmenes para hot-reloading y exponiendo puertos locales (3000, 5173, 5432).
- `docker-compose.prod.yml`: Aplica configuraciones exclusivas para **Producción**, utilizando Dockerfiles multi-etapa (`Dockerfile.prod`) que generan artefactos optimizados (ej. Nginx para el frontend), sin montajes locales y con políticas `restart: always`.

## Consecuencias
### Positivas
- Paridad entre el entorno local y el pipeline CI/CD.
- Separación clara de responsabilidades y facilidades para depuración en desarrollo sin comprometer la postura de seguridad de producción.
### Negativas
- Mayor mantenimiento de múltiples archivos de configuración de infraestructura.
