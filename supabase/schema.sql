-- ═══════════════════════════════════════════════════════════
-- RUVA COMMAND CENTER - Schema SQL para Supabase
-- Ejecuta este script completo en: Supabase Dashboard > SQL Editor
-- ═══════════════════════════════════════════════════════════

-- PROJECTS
CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  deadline DATE,
  color TEXT DEFAULT '#3B82F6',
  tasks_count INT DEFAULT 0,
  completed_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FOLDERS (para notas)
CREATE TABLE folders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📁',
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TASKS
CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  time TEXT DEFAULT '09:00',
  duration INT DEFAULT 30,
  category TEXT DEFAULT 'personal',
  done BOOLEAN DEFAULT FALSE,
  date DATE NOT NULL,
  project_id BIGINT REFERENCES projects(id) ON DELETE SET NULL,
  subtasks JSONB DEFAULT '[]'::jsonb,
  recurring TEXT DEFAULT 'none',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTES
CREATE TABLE notes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  pinned BOOLEAN DEFAULT FALSE,
  folder_id BIGINT REFERENCES folders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INBOX (captura rápida)
CREATE TABLE inbox (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USER PROFILE (score, streak, level)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  score_total INT DEFAULT 0,
  score_streak INT DEFAULT 0,
  score_level INT DEFAULT 1,
  last_activity DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- ÍNDICES para velocidad (queries más rápidas)
-- ═══════════════════════════════════════════════════════════
CREATE INDEX idx_tasks_user_date ON tasks(user_id, date);
CREATE INDEX idx_tasks_user_done ON tasks(user_id, done);
CREATE INDEX idx_notes_user ON notes(user_id, pinned DESC, created_at DESC);
CREATE INDEX idx_inbox_user ON inbox(user_id, created_at DESC);
CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_folders_user ON folders(user_id);

-- ═══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY: cada usuario solo ve sus datos
-- ═══════════════════════════════════════════════════════════
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas: el usuario solo puede hacer CRUD de sus propios datos
CREATE POLICY "own_projects" ON projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_folders" ON folders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_tasks" ON tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_notes" ON notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_inbox" ON inbox FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_profile" ON profiles FOR ALL USING (auth.uid() = id);

-- ═══════════════════════════════════════════════════════════
-- TRIGGER: crear perfil automáticamente al registrarse
-- ═══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id) VALUES (NEW.id);
  -- Crear carpetas default
  INSERT INTO folders (user_id, name, icon, color) VALUES
    (NEW.id, 'Ideas & Inspiración', '💡', '#F59E0B'),
    (NEW.id, 'Clientes', '👥', '#3B82F6'),
    (NEW.id, 'Técnico', '⚙️', '#06B6D4'),
    (NEW.id, 'Personal', '🌱', '#10B981');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
