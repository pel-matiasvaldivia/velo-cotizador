-- 001_initial.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Leads / Prospectos
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(200) NOT NULL,
  empresa VARCHAR(200),
  email VARCHAR(200) NOT NULL,
  telefono VARCHAR(50),
  provincia VARCHAR(100),
  como_conocio VARCHAR(100),
  canal VARCHAR(20) NOT NULL CHECK (canal IN ('web', 'whatsapp')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cotizaciones
CREATE TABLE cotizaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id),
  numero_cotizacion VARCHAR(20) UNIQUE NOT NULL, -- VEL-2024-0001
  division VARCHAR(20) CHECK (division IN ('vino', 'cerveza', 'industrial', 'multiple')),
  descripcion_proyecto TEXT,
  nivel_automatizacion VARCHAR(50),
  tipo_instalacion VARCHAR(50),
  total_estimado_usd_min INTEGER,
  total_estimado_usd_max INTEGER,
  tiempo_fabricacion_semanas INTEGER,
  requiere_visita_tecnica BOOLEAN DEFAULT FALSE,
  prioridad_comercial VARCHAR(10) DEFAULT 'media',
  estado VARCHAR(30) DEFAULT 'nueva' CHECK (estado IN ('nueva','revisada','enviada','en_negociacion','ganada','perdida','archivada')),
  ai_response JSONB,          -- respuesta completa de la IA
  pdf_url TEXT,               -- URL del PDF en MinIO
  notas_internas TEXT,
  asignado_a VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items de cotización
CREATE TABLE cotizacion_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cotizacion_id UUID REFERENCES cotizaciones(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  detalle_tecnico TEXT,
  precio_min_usd INTEGER,
  precio_max_usd INTEGER,
  tiempo_fabricacion_semanas INTEGER,
  orden INTEGER DEFAULT 0
);

-- Mensajes WhatsApp (historial)
CREATE TABLE whatsapp_mensajes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telefono VARCHAR(50) NOT NULL,
  cotizacion_id UUID REFERENCES cotizaciones(id),
  rol VARCHAR(10) CHECK (rol IN ('user', 'assistant')),
  contenido TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_telefono ON leads(telefono);
CREATE INDEX idx_cotizaciones_lead ON cotizaciones(lead_id);
CREATE INDEX idx_cotizaciones_estado ON cotizaciones(estado);
CREATE INDEX idx_cotizaciones_division ON cotizaciones(division);
CREATE INDEX idx_whatsapp_telefono ON whatsapp_mensajes(telefono);

-- Secuencia para número de cotización
CREATE SEQUENCE cotizacion_seq START 1;

-- Función para generar número de cotización
CREATE OR REPLACE FUNCTION gen_cotizacion_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.numero_cotizacion := 'VEL-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('cotizacion_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_cotizacion_number
  BEFORE INSERT ON cotizaciones
  FOR EACH ROW
  EXECUTE FUNCTION gen_cotizacion_number();
