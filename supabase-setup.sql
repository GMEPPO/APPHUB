-- Ejecuta este SQL en el Supabase SQL Editor para crear la tabla de aplicaciones
-- Dashboard Supabase -> SQL Editor -> New query

CREATE TABLE IF NOT EXISTS apps (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  link TEXT NOT NULL,
  icon TEXT,                    -- URL completa O ruta en bucket "Icons app hub" (ej: 'powerbi.png')
  icon_emoji TEXT,              -- Emoji (opcional). Se usa solo si no hay icon
  category_es TEXT,             -- Una o más categorías en español, separadas por coma (ej: 'Comercial, Geral, Suporte')
  category_pt TEXT,             -- Una o más categorías en portugués, mismo orden que category_es (ej: 'Comercial, Geral, Suporte')
  orden INT DEFAULT 0,          -- Para ordenar los botones
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) - permite lectura pública para anon
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;

-- Política: permitir lectura pública a todos (DROP evita error si ya existe)
DROP POLICY IF EXISTS "Allow public read access" ON apps;
CREATE POLICY "Allow public read access" ON apps
  FOR SELECT USING (true);

-- Si la tabla ya existía, añadir columnas de categoría si faltan:
ALTER TABLE apps ADD COLUMN IF NOT EXISTS category_es TEXT;
ALTER TABLE apps ADD COLUMN IF NOT EXISTS category_pt TEXT;

-- Para usar imágenes del bucket "Icons app hub": sube el archivo y usa la ruta en icon.
-- Ejemplo: icon = 'powerbi.png' o 'logos/powerbi.png'

-- Categorías: pueden ser varias por app, separadas por coma. category_es y category_pt deben tener
-- el mismo número de valores en el mismo orden (ej: category_es='Comercial, Geral' category_pt='Comercial, Geral').

-- Ejemplo con varias categorías por app: category_es='Comercial, Geral' hace que el botón aparezca en ambos filtros.
-- Datos de ejemplo (opcional - puedes eliminarlos después)
INSERT INTO apps (name, link, icon_emoji, category_es, category_pt, orden) VALUES
  ('Power BI', 'https://app.powerbi.com', '📊', 'BI, Geral', 'BI, Geral', 1),
  ('Salesforce CRM', 'https://login.salesforce.com', '☁️', 'CRM', 'CRM', 2),
  ('HR & Payroll', 'https://example.com/hr', '👤', 'RRHH', 'Recursos Humanos', 3),
  ('Project Management', 'https://example.com/projects', '📋', 'Proyectos', 'Projetos', 4),
  ('ERP System', 'https://example.com/erp', '⚙️', NULL, NULL, 5),
  ('IT Help Desk', 'https://example.com/helpdesk', '🎧', 'IT', 'IT', 6);
