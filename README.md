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
| `icon`     | text  | No          | URL completa o ruta en bucket "Icons app hub" (ej: `powerbi.png`) |
| `icon_emoji` | text | No        | Emoji como icono (ej: '📊'). Prioridad sobre `icon` |
| `category_es` | text | No      | Una o más categorías en español, separadas por coma (ej: `Comercial, Geral`) |
| `category_pt` | text | No      | Mismas categorías en portugués, mismo orden (ej: `Comercial, Geral`) |
| `orden`    | int   | No          | Orden de aparición (menor = primero) |

**Categorías:** rellena `category_es` y `category_pt` para que los botones del menú y el título de la sección se muestren en el idioma seleccionado.

**Iconos:** puedes usar `icon_emoji`, o `icon` con: una URL completa (`https://...`) o la ruta del archivo en el bucket Supabase Storage "Icons app hub". Si ambos están vacíos, se usa la primera letra del nombre.
