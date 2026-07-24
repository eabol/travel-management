Prompt 0: Estructura del Proyecto y Documentación
Estructura el proyecto según el monorepo e inicializa la documentación.

0. Crea las carpetas:
   - docs/
   - backend/src/
   - backend/src/api/
   - backend/src/database/
   - backend/tests/
   - frontend/src/

1. Inicializa el archivo docs/TODO.md con la lista de tareas.

2. Inicializa el archivo docs/HISTORY.md para registrar el progreso.

3. Inicializa el archivo docs/LESSONS.md para guardar aprendizajes.

4. Crea una carpeta docs/adrs/ para los Architectural Decision Records.

Prompt 1: Infraestructura Docker y Base de Datos

Configura la infraestructura base con Docker en la raíz del monorepo.
0. Crear Dockerfile para backend y frontend.
1. Crea docker-compose.yml base definiendo el servicio db (PostgreSQL 15+). Monta ./backend/database/init en /docker-entrypoint-initdb.d/.
2. Crea docker-compose.override.yml para desarrollo (puertos y variables locales).
3. Crea docker-compose.prod.yml simulando la configuración de producción.


Prompt 2: Esquema de Base de Datos

1. Genera el código SQL para backend/database/init/schema.sql.
2. Crea las tablas: users, roles, user_roles, viaticos y audit_log usando UUID para los IDs, TIMESTAMPTZ para fechas y Foreign Keys con ON DELETE CASCADE.
3. Añade restricciones CHECK para estados de viáticos ('Borrador', 'Enviado', 'Aprobado', 'Rechazado').
4. Incluye un script seed al final para roles por defecto y un usuario Administrador.



Prompt 3: Backend con Arquitectura Modular y TDD (Mock API)
Mock/Simulación de API Externa Instituciona
1. Inicia el desarrollo del Backend con TDD para el módulo externo POST /api/v1/external/users.
2. Crea la estructura modular del backend: backend/index.ts, backend/bin/www y el módulo backend/api/external/ conteniendo routes.ts y controller.ts.
3. En index.ts, integra los middlewares de seguridad (helmet y express-rate-limit) y manejo global de errores.
4. Crea el archivo de pruebas backend/tests/externalApi.test.ts aplicando el patrón AAA y Caja Negra (revisando códigos HTTP 201 y 400).
5. Implementa el controller solo como mocks y las rutas en routes.ts, sin usar la bd, para pasar las pruebas en verde.


Prompt 4: Arquitectura Frontend (Vuetify & MD3)
Inicia la arquitectura base del Frontend (Vue 3 + Vuetify).

1. Configura Vuetify 3 con Material Design 3 (MD3).
2. Estructura carpetas bajo el patrón Smart/Dumb Components.
3. Crea un componente Dumb de ejemplo con <script setup> y accesibilidad A11y.
4. Escribe una prueba unitaria con Vitest usando AAA y Caja Negra."