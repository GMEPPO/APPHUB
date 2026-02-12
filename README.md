# Company Apps Hub

Centro de aplicaciones empresarial con diseño oscuro. Los botones se generan automáticamente desde Supabase.

## Configuración

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto
2. En **SQL Editor**, ejecuta el contenido del archivo `supabase-setup.sql`
3. En **Settings → API**, copia la **Project URL** y la **anon public** key

### 2. Variables de entorno

Copia `.env.example` a `.env` y rellena:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

### 3. Instalar y ejecutar

```bash
npm install
npm run dev
```

## Estructura de la tabla `apps` en Supabase

| Columna     | Tipo  | Obligatorio | Descripción                          |
|------------|-------|-------------|--------------------------------------|
| `name`     | text  | Sí          | Nombre del botón                     |
| `link`     | text  | Sí          | URL de redirección                   |
| `icon`     | text  | No          | URL de imagen para el icono          |
| `icon_emoji` | text | No        | Emoji como icono (ej: '📊')          |
| `orden`    | int   | No          | Orden de aparición (menor = primero) |

Si no usas `icon` ni `icon_emoji`, se mostrará la primera letra del nombre.
