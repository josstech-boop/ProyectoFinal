-- Tabla de usuarios (alumnos, docentes, admin)
CREATE TABLE usuarios (
  id SERIAL primary key,
  nombre VARCHAR(100) not null,
  correo VARCHAR(100) unique not null,
  password VARCHAR(255) not null,
  rol VARCHAR(20) not null CHECK (rol IN ('alumno', 'docente', 'admin'))
);

-- Tabla de grados (Carreras de diversificado o nivel básico)
CREATE TABLE grados (
  id SERIAL primary key,
  nombre VARCHAR(50) not null unique
);

-- Tabla alumnos y grados
CREATE TABLE alumnos_grados (
  alumno_id INT not null,
  grado_id INT not null,
  primary key (alumno_id, grado_id),
  foreign key (alumno_id) references usuarios(id) ON DELETE CASCADE,
  foreign key (grado_id) references grados(id) ON DELETE CASCADE
);

-- Tabla docentes y grados
CREATE TABLE docentes_grados (
  docente_id INT not null,
  grado_id INT not null,
  primary key (docente_id, grado_id),
  foreign key (docente_id) references usuarios(id) ON DELETE CASCADE,
  foreign key (grado_id) references grados(id) ON DELETE CASCADE
);

-- Tabla de asistencias
CREATE TABLE asistencias (
  id SERIAL primary key,
  alumno_id INT not null,
  grado_id INT not null,
  fecha DATE not null DEFAULT CURRENT_DATE,
  estado VARCHAR(20) not null CHECK (estado IN ('presente', 'ausente', 'justificado')),
  unique (alumno_id, fecha), -- evita duplicados en un mismo día
  foreign key (alumno_id) references usuarios(id) ON DELETE CASCADE,
  foreign key (grado_id) references grados(id) ON DELETE CASCADE
);

-- Indices para mejorar el rendimiento
CREATE INDEX idx_asistencias_alumno ON asistencias(alumno_id);
CREATE INDEX idx_asistencias_grado ON asistencias(grado_id);
CREATE INDEX idx_asistencias_fecha ON asistencias(fecha);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);