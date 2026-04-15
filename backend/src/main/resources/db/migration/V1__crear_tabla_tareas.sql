CREATE TABLE IF NOT EXISTS tareas (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(120) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tareas_estado_check CHECK (estado IN ('PENDIENTE', 'COMPLETADA')),
    CONSTRAINT tareas_titulo_check CHECK (length(trim(titulo)) > 0)
);

CREATE OR REPLACE FUNCTION actualizar_fecha_tarea()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tareas_actualizar_fecha ON tareas;

CREATE TRIGGER tareas_actualizar_fecha
BEFORE UPDATE ON tareas
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_tarea();
