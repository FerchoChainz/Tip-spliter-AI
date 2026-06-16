# Tipspliter 💸

**Tipspliter** es una aplicación web moderna diseñada para la gestión eficiente y transparente del reparto de propinas en entornos de hostelería (restaurantes, bares, cafeterías). Permite a los administradores y chefs llevar un control diario de las propinas recibidas, asignar el personal que trabajó en cada jornada y automatizar los cálculos de distribución semanal.

---

## 🚀 Características Principales

### 📊 Dashboard de Control
*   **Estadísticas en tiempo real:** Visualización de propinas totales, promedio por persona y número de empleados activos.
*   **Resumen Semanal:** Gráficos y métricas que ayudan a entender la progresión de los ingresos por propinas.

### 👥 Gestión de Personal (Staff)
*   **Listado de Empleados:** Gestión completa del equipo de trabajo.
*   **Historial Individual:** Consulta de las propinas acumuladas por cada miembro del staff.
*   **Estado Activo/Inactivo:** Control de quién está disponible para el reparto diario.

### 📅 Reparto Diario (Daily Split)
*   **Cálculo Automático:** Ingresa el total de propinas del día y selecciona al personal presente; la app calcula automáticamente la parte proporcional para cada uno.
*   **Acordeón por Días:** Organización clara de lunes a domingo para un registro ordenado.

### 🗓️ Resumen Semanal y Cierre
*   **Línea de Tiempo:** Historial de cierres diarios.
*   **Finalización de Semana:** Función para cerrar el ciclo semanal, archivando los datos y preparando el sistema para el siguiente periodo.

### 🔒 Autenticación y Seguridad
*   **Acceso Protegido:** Integración con **Supabase Auth** para asegurar que solo el personal autorizado (Managers/Chefs) pueda realizar modificaciones.

---

## 🛠️ Stack Tecnológico

*   **Frontend:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
*   **Backend & DB:** [Supabase](https://supabase.com/) (PostgreSQL + Auth)
*   **Iconografía:** SVG Custom / Lucide Icons
*   **Linter:** ESLint + TypeScript ESLint

---

## 📦 Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente:

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/tipspliter.git
cd tipspliter
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configuración de Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto y añade tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 4. Ejecutar en modo desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

---

## 🏗️ Estructura del Proyecto

```text
src/
├── components/     # Componentes reutilizables (Auth, Dashboard, StaffList, etc.)
├── hooks/          # Hooks personalizados para fetching de datos (useStaff, useDailyLogs)
├── lib/            # Configuración de librerías externas (Supabase client)
├── data/           # Datos mock para desarrollo inicial
├── assets/         # Imágenes y recursos estáticos
├── App.tsx         # Componente principal y enrutado lógico
└── main.tsx        # Punto de entrada de la aplicación
```

---

## 📝 Roadmap / Próximas Mejoras

- [ ] Implementación de TanStack Query para manejo de estado asíncrono.
- [ ] Reportes exportables en formato PDF/Excel.
- [ ] Notificaciones push para el personal al cierre del día.
- [ ] Soporte para múltiples roles con diferentes niveles de acceso.

---

## 📄 Licencia

Este proyecto es privado. Consulta el archivo `SECURITY.md` para más información sobre el manejo de vulnerabilidades.

---

Desarrollado con ❤️ para mejorar la gestión en hostelería.
