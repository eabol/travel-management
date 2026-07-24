# ADR 003: Adopción del Sistema Material Design 3 (MD3) Expressive Design en el Frontend

## Estado
Aprobado

## Contexto
Se requería definir el sistema visual y de componentes para el frontend de la aplicación web de Gestión de Viáticos (Vue.js 3), asegurando una experiencia de usuario moderna, fluida y responsiva.

## Decisión
Se seleccionó **Vuetify 3** configurado con el paradigma de **Material Design 3 (MD3) Expressive Design** y se prohibió explícitamente el uso de Tailwind CSS.
- **Paleta de Colores Expressive:** Uso del tono primario `Purple (#6750A4)`, contenedores pastel y acentos terciarios rosados.
- **Formas y Geometría MD3:** Tarjetas con esquinas redondeadas *Extra Large* (28px), botones tipo *Pill* (100px border-radius) y campos de texto suavizados.
- **Micro-interacciones:** Fondos translúcidos con efectos de desenfoque (`backdrop-filter: blur(16px)`) y elevación en hover.
- **Patrón Smart/Dumb Components:** Separación de componentes presentacionales puros (`src/components/dumb/`) de aquellos con lógica de API y stores (`src/components/smart/`).

## Consecuencias
### Positivas
- Interfaz de usuario altamente consistente y estética desde la primera interacción.
- Cumplimiento de estándares de accesibilidad WAI-ARIA nativos de Vuetify 3.
- Mantenibilidad basada en la jerarquía oficial de tokens de Material Design 3.
### Negativas
- Curva de configuración inicial en Vuetify para personalizar esquemas de colores MD3 complejos.
