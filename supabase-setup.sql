-- Ejecuta este SQL en el Supabase SQL Editor para crear la tabla de aplicaciones
-- Dashboard Supabase -> SQL Editor -> New query

CREATE TABLE IF NOT EXISTS apps (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  link TEXT NOT NULL,
  icon TEXT,                    -- URL de imagen (opcional)
  icon_emoji TEXT,              -- Emoji como icono (opcional, ej: '📊')
  orden INT DEFAULT 0,          -- Para ordenar los botones
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) - permite lectura pública para anon
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;

-- Política: permitir lectura pública a todos
CREATE POLICY "Allow public read access" ON apps
  FOR SELECT USING (true);

-- Datos de ejemplo (opcional - puedes eliminarlos después)
INSERT INTO apps (name, link, icon_emoji, orden) VALUES
  ('Power BI', 'https://app.powerbi.com', '📊', 1),
  ('Salesforce CRM', 'https://login.salesforce.com', '☁️', 2),
  ('HR & Payroll', 'https://example.com/hr', '👤', 3),
  ('Project Management', 'https://example.com/projects', '📋', 4),
  ('ERP System', 'https://example.com/erp', '⚙️', 5),
  ('IT Help Desk', 'https://example.com/helpdesk', '🎧', 6);
