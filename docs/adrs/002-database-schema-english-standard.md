# ADR 002: Estándar de Idioma de Código en Inglés y Nomenclatura Relacional de Base de Datos

## Estado
Aprobado

## Contexto
El sistema manejaba inicialmente nombres en español en la base de datos (ej. tabla `viaticos`, estados `'Borrador'`, `'Enviado'`). Sin embargo, las reglas de arquitectura y estándares del proyecto dictan que todo el código (variables, tablas, endpoints, clases y funciones) debe escribirse estrictamente en **Inglés**, manteniendo únicamente la documentación descriptiva (`.md`) en **Español**.

## Decisión
Se decidió refactorizar y migrar completamente el esquema relacional en PostgreSQL y la capa backend:
1. Renombrar la tabla `viaticos` a **`travel_expenses`**.
2. Renombrar la tabla `audit_log` a **`audit_logs`** (cumpliendo con la convención de plural para tablas).
3. Cambiar los estados restringidos por la restricción `CHECK` a inglés: `'Draft'`, `'Submitted'`, `'Approved'`, `'Rejected'`.
4. Hashing de contraseñas de usuarios semilla utilizando el algoritmo seguro **Argon2id** (`$argon2id$`).

## Consecuencias
### Positivas
- Cumplimiento estricto del estándar de código en inglés en todas las capas del proyecto.
- Interoperabilidad y legibilidad estandarizada para desarrolladores e integraciones internacionales.
- Hashing de alta seguridad para credenciales por defecto.
### Negativas
- Necesidad de recrear el esquema de base de datos en entornos existentes.
