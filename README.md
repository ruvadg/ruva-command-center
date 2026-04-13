# RUVA Command Center

Tu centro de mando personal — agenda, proyectos, inbox, notas y progreso.
Optimizado para ser **rápido** en celular y escritorio, con sync automático en la nube.

---

## Deploy paso a paso (30 min total)

Sigue estos 4 pasos en orden. Al final tendrás la app viva en una URL tipo `ruva.vercel.app`.

### Paso 1 — Crear cuenta en Supabase (5 min)

Supabase es la base de datos y autenticación. **Es gratis** para lo que necesitas.

1. Entra a https://supabase.com y haz click en **Start your project**.
2. Regístrate con tu email o con GitHub.
3. Click en **New project**.
4. Llena:
   - **Name**: `ruva-command-center` (o el nombre que quieras)
   - **Database Password**: genera una contraseña fuerte y **guárdala** (no la vas a necesitar para esto, pero por si acaso)
   - **Region**: la más cercana a ti (ej: `West US (North California)` o `South America (São Paulo)`)
5. Click en **Create new project**. Tarda 1-2 min.

### Paso 2 — Crear las tablas en Supabase (3 min)

1. En tu proyecto de Supabase, sidebar izquierdo → click en **SQL Editor** (ícono `</>`)
2. Click en **+ New query**
3. Abre el archivo `supabase/schema.sql` de este proyecto, copia TODO el contenido
4. Pégalo en el editor SQL de Supabase
5. Click en **Run** (abajo a la derecha) o pulsa `Ctrl + Enter`
6. Deberías ver: `Success. No rows returned.`

Con esto tienes:
- Todas las tablas (tareas, proyectos, notas, carpetas, inbox, perfil)
- Seguridad activa (cada usuario solo ve sus propios datos)
- Trigger que crea carpetas default al registrarte

### Paso 3 — Copiar tus llaves de Supabase (1 min)

1. En tu proyecto Supabase, sidebar → **Settings** (ícono engranaje)
2. Click en **API**
3. Copia estos dos valores:
   - **Project URL** (ej: `https://abcxyz.supabase.co`)
   - **anon / public** key (una clave larga que empieza con `eyJ...`)
4. Guárdalos en un bloc de notas temporal

### Paso 4 — Deploy en Vercel (5 min)

Vercel hospeda la app. **Es gratis** y súper rápido.

#### 4a. Subir código a GitHub

Si no tienes Git configurado, la forma más fácil es:

1. Ve a https://github.com y crea un repositorio nuevo llamado `ruva-app` (privado está bien)
2. En tu compu, abre terminal en la carpeta `ruva-app` y corre:

```bash
git init
git add .
git commit -m "RUVA Command Center"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/ruva-app.git
git push -u origin main
```

*(Si no tienes Git instalado, descárgalo en https://git-scm.com)*

#### 4b. Conectar Vercel

1. Entra a https://vercel.com y regístrate con GitHub
2. Click en **Add New... → Project**
3. Selecciona tu repo `ruva-app` → **Import**
4. Antes de click en "Deploy", expande **Environment Variables** y agrega:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | (tu Project URL del paso 3) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (tu anon key del paso 3) |

5. Click en **Deploy**
6. Espera 1-2 min. Cuando termine, te da una URL tipo `https://ruva-app-abc.vercel.app`

### Paso 5 — Configurar Supabase para aceptar tu URL de Vercel (1 min)

Para que el magic link te redirija bien:

1. En Supabase → **Authentication** → **URL Configuration**
2. En **Site URL** pon tu URL de Vercel: `https://ruva-app-abc.vercel.app`
3. En **Redirect URLs** agrega: `https://ruva-app-abc.vercel.app/auth/callback`
4. Click en **Save**

### Paso 6 — ¡Entra a tu app!

1. Abre tu URL de Vercel en el celular y en la PC
2. Pon tu email → click en "Enviar link mágico"
3. Revisa tu correo, dale click al link
4. Listo: todo lo que hagas en el celular se sincroniza con la PC y viceversa

Guarda la URL como marcador en ambos dispositivos. En iOS puedes "Agregar a pantalla de inicio" desde Safari para que se vea como una app nativa.

---

## Desarrollo local (opcional)

Si quieres correr la app en tu compu para hacer cambios:

```bash
# 1. Instala dependencias
npm install

# 2. Crea archivo .env.local
cp .env.example .env.local
# Edítalo y pon tus llaves de Supabase

# 3. Corre el servidor
npm run dev

# Abre http://localhost:3000
```

---

## Estructura del proyecto

```
ruva-app/
├── src/
│   ├── app/
│   │   ├── layout.jsx          # Layout raíz
│   │   ├── page.jsx            # Home (con auth check)
│   │   ├── globals.css         # Estilos globales
│   │   ├── login/page.jsx      # Magic link login
│   │   └── auth/callback/      # OAuth callback
│   ├── components/
│   │   └── RuvaApp.jsx         # App principal
│   └── lib/
│       ├── supabase.js         # Cliente browser
│       ├── supabase-server.js  # Cliente server
│       └── useRuvaData.js      # Hook con optimistic updates
├── supabase/
│   └── schema.sql              # DB schema
├── middleware.js               # Session refresh
└── package.json
```

## Características

- **Agenda diaria y semanal** con tareas, horarios y categorías
- **Subtareas** expandibles en cada actividad
- **Tareas recurrentes** (diaria / semanal / mensual)
- **Reprogramar** al día anterior/siguiente con un click, o fecha específica
- **Inbox de captura rápida** (⌘K desde cualquier lado) → convierte a tarea o nota
- **Proyectos** con deadlines y progreso
- **Notas** organizadas en carpetas con colores
- **Scoring** con nivel, racha y puntos
- **Optimistic UI** — la app responde al instante, la sincronización ocurre en background
- **Mobile + Desktop** con layouts adaptativos
- **Dark theme** con estética azul/índigo

## Atajos de teclado

- `⌘K` / `Ctrl+K` — Captura rápida al inbox
- `⌘N` / `Ctrl+N` — Nueva tarea
- `Esc` — Cerrar modales

## Costos

**$0/mes** para uso personal:
- Supabase free: 500 MB DB, 50k auth users, 2 GB transfer
- Vercel free: 100 GB bandwidth, deploys ilimitados

Te sobra espacio para años de uso personal.
