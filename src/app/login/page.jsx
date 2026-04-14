"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

function RuvaLogo({ size = 80 }) {
  return (
    <svg viewBox="0 0 2058.62 644.01" style={{ width: size, height: "auto" }}>
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
      </defs>
      <text x="50%" y="55%" textAnchor="middle" fill="url(#g1)" fontSize="480" fontWeight="900" fontFamily="-apple-system, sans-serif" letterSpacing="-20">RUVA</text>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    if (password.length < 6) {
      setErr("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    setErr("");
    setMsg("");
    try {
      const supabase = getSupabase();
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) {
          setMsg("Cuenta creada. Revisa tu email para confirmar y luego inicia sesión.");
          setMode("signin");
          setPassword("");
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
        router.refresh();
      }
    } catch (e) {
      setErr(e.message || "Error al autenticar");
    } finally {
      setLoading(false);
    }
  }

  const isSignup = mode === "signup";

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0A0E1A 0%, #0F1629 100%)",
      padding: 24,
    }}>
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: 40,
        backdropFilter: "blur(10px)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <RuvaLogo size={90} />
          <div style={{ color: "#64748B", fontSize: 13, marginTop: 8, letterSpacing: 2 }}>
            COMMAND CENTER
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
            {isSignup ? "Crear cuenta" : "Bienvenido"}
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 14, marginBottom: 24 }}>
            {isSignup
              ? "Elige tu email y una contraseña."
              : "Ingresa tu email y contraseña."}
          </p>

          <input
            type="email"
            required
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              color: "#fff",
              fontSize: 15,
              outline: "none",
              marginBottom: 12,
            }}
          />

          <input
            type="password"
            required
            minLength={6}
            placeholder="Contraseña (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              color: "#fff",
              fontSize: 15,
              outline: "none",
              marginBottom: 16,
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 16px",
              background: "linear-gradient(135deg, #3B82F6, #818CF8)",
              borderRadius: 12,
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading
              ? (isSignup ? "Creando..." : "Entrando...")
              : (isSignup ? "Crear cuenta" : "Entrar")}
          </button>

          {err && (
            <div style={{
              marginTop: 12, padding: 12, borderRadius: 8,
              background: "rgba(239,68,68,0.1)", color: "#F87171", fontSize: 13,
            }}>{err}</div>
          )}

          {msg && (
            <div style={{
              marginTop: 12, padding: 12, borderRadius: 8,
              background: "rgba(59,130,246,0.1)", color: "#93C5FD", fontSize: 13,
            }}>{msg}</div>
          )}

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button
              type="button"
              onClick={() => {
                setMode(isSignup ? "signin" : "signup");
                setErr("");
                setMsg("");
              }}
              style={{
                color: "#3B82F6",
                fontSize: 13,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {isSignup
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Créala"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
