# Definición Técnica del Proyecto: Sistema de Gestión de Viáticos

## 1. Resumen Ejecutivo
Desarrollo de un módulo interno autónomo para la **Gestión de Viáticos** mediante una arquitectura de microservicios contenerizada. El sistema será autocontenido, simulando integraciones con los sistemas core institucionales de Recursos Humanos. Se exige un enfoque de desarrollo basado en **TDD (Test-Driven Development)** para garantizar la auto-validación del sistema en un pipeline de CI/CD, y contará con una infraestructura Docker segmentada para entornos de Desarrollo y Producción.

---

## 2. Stack Tecnológico y Metodología

*   **Frontend:** Vue.js v3 (Composition API, Pinia).
*   **Backend:** Node.js (Express / NestJS) o PHP.
*   **Base de Datos:** PostgreSQL.
*   **Metodología:** TDD (Test-Driven Development) estricto (Red-Green-Refactor).
*   **Testing:** Vitest (Node.js), Vitest / Vue Test Utils (Frontend).
*   **Infraestructura:** Docker, Docker Compose (Configuraciones multi-entorno).
*   **CI/CD:** GitLab CI (`.gitlab-ci.yml`).
*   **Seguridad:** JWT (JSON Web Tokens), API Tokens, Middleware RBAC.

---

## 3. Arquitectura y Orquestación Multi-Entorno (Docker)

El sistema se dividirá en contenedores gestionados por `docker-compose`. La orquestación utilizará la composición y sobrescritura de archivos para manejar distintos entornos:

1.  **Servicio `db`:** Contenedor PostgreSQL.
2.  **Servicio `api`:** Backend que expondrá la API de viáticos y los endpoints simulados (mocks).
3.  **Servicio `web`:** Aplicación cliente en Vue.js.

### Archivos de Configuración Docker:
*   **`docker-compose.yml`**: Archivo base con la configuración común (redes, variables, imágenes base).
*   **`docker-compose.override.yml`**: Configuración para **Desarrollo (Dev)**. Incluye montaje de volúmenes locales para *hot-reloading*, puertos para debugging y variables de entorno de pruebas.
*   **`docker-compose.prod.yml`**: Configuración para **Producción (Prod)**. Utiliza imágenes pre-construidas estáticas, expone solo puertos necesarios e implementa políticas de reinicio (`restart: always`).

---

## 4. Diseño del Modelo de Datos (`schema.sql`)

El script de inicialización SQL debe contemplar las siguientes tablas y sus relaciones:

| Table | Main Description |
| :--- | :--- |
| **users** | Stores users, passwords (hash), and tokens. |
| **roles** | System roles catalog. |
| **user_roles** | Pivot table to assign roles to users. |
| **travel_expenses** | Stores requests (destination, amount, dates, user_id). |
| **audit_logs** | System actions audit log. |

**Allowed statuses for `travel_expenses`:** `Draft`, `Submitted`, `Approved`, `Rejected`.

---

## 5. Definición de APIs (Mocks y Core)

### 5.1. Desafío A: Mock/Simulación de API Externa Institucional
*   `POST /api/v1/external/users`: Registra un usuario y genera un API Token inicial.
*   `POST /api/v1/external/login`: Valida credenciales y devuelve el JWT de sesión.
*   `POST /api/v1/external/audit`: Recibe un payload de evento y lo inserta en la tabla `audit_logs`.

### 5.2. Desafío B: API Interna de Viáticos (Protegida por JWT)
*   `POST /api/v1/travel-expenses`: Crea una solicitud.
*   `GET /api/v1/travel-expenses`: Lista solicitudes filtradas según el rol del usuario.
*   `PATCH /api/v1/travel-expenses/:id/status`: Cambia el estado de una solicitud.
*   `GET /api/v1/audit`: Recupera la bitácora general.

---

## 6. Control de Acceso y Permisos (RBAC)

El acceso a los endpoints internos debe estar protegido por middlewares que validen el rol del usuario. Esta lógica debe estar **cubierta 100% por pruebas TDD**.

| Rol | Nivel de Acceso y Permisos |
| :--- | :--- |
| **requester** | Crea, edita (solo en estado *Draft*) y visualiza **únicamente** sus propias solicitudes. |
| **approver** | Visualiza todas las solicitudes *Submitted*. Puede cambiar el estado a *Approved* o *Rejected*. (Cada cambio debe disparar un registro al mock de auditoría). |
| **admin** | Vista global de lectura de todos los viáticos. Acceso exclusivo a la lectura de la bitácora de auditoría. |

---

## 7. Pipeline de Integración Continua (`.gitlab-ci.yml`)

Debe definir 3 etapas (*stages*):
1.  **lint / test:** Ejecución obligatoria de la suite de pruebas TDD. **Debe bloquear el pipeline si falla.**
2.  **build:** Construcción de las imágenes Docker orientadas a producción.
3.  **deploy:** Script simulado que utiliza el archivo de producción (ej. `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d`).

---

## 8. Flujo de Trabajo Documental y Gestión de IA

Para asegurar la trazabilidad del proyecto, cualquier IA o desarrollador interactuando con este repositorio debe respetar la siguiente estructura dentro del directorio `docs/`:

*   **`main-reqs.md`:** Este archivo. Contiene los requerimientos inmutables del sistema.
*   **`TODO.md`:** Lista de tareas a realizar antes de ejecutar código. Debe actualizarse constantemente.
*   **`HISTORY.md`:** Registro cronológico de acciones ejecutadas, archivos modificados y tareas completadas.
*   **`LESSONS.md`:** Documentación de bugs resueltos, auditorías de seguridad, correcciones sintácticas y aprendizajes.
*   **`adrs/` (Directorio):** Carpeta para guardar los Registros de Decisiones Arquitectónicas (ADR) en formato Markdown cada vez que se toma una decisión técnica importante.

---

## 9. Lista de Entregables Finales

- [ ] Código fuente completo del Frontend y Backend.
- [ ] Suite de Pruebas (TDD) funcional y validando el RBAC.
- [ ] Archivo `schema.sql` con definición de BBDD, restricciones FK y datos semilla.
- [ ] Archivos de orquestación Docker (`docker-compose.yml`, `override` y `prod`).
- [ ] Archivo `.gitlab-ci.yml` funcional y bloqueante ante fallos.
- [ ] Documentación Swagger o Colección Postman de las APIs.
- [ ] Directorio `docs/` completo y actualizado con el registro del proyecto.