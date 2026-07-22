-- 002_portal.sql
-- Portal comercial: usuarios (auth) y catálogo de productos.
-- Idempotente: se puede aplicar sobre una base existente sin romper nada.

-- Usuarios del portal (equipo comercial / admin)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  password_hash VARCHAR(200) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'comercial' CHECK (rol IN ('admin','comercial')),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- Catálogo de productos con costos y márgenes
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  division VARCHAR(20) NOT NULL CHECK (division IN ('vino','cerveza','industrial','multiple')),
  categoria VARCHAR(100),
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  unidad VARCHAR(30) NOT NULL DEFAULT 'unidad',
  costo_base_usd NUMERIC(14,2) NOT NULL DEFAULT 0,
  margen_pct NUMERIC(6,2) NOT NULL DEFAULT 30,
  especificaciones JSONB,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_productos_division ON productos(division);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);

-- Nota: el usuario admin inicial lo crea la aplicación al arrancar
-- (UsersService.onModuleInit) usando ADMIN_EMAIL / ADMIN_PASSWORD,
-- con la contraseña ya hasheada con bcrypt.
