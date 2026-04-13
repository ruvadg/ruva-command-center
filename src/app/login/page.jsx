"use client";
import { useState } from "react";
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
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [err, setErr] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    setErr("");
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setStatus("sent");
    } catch (e) {
      setErr(e.message || "Error enviando el link");
      setStatus("error");
    }
  }

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

        {status === "sent" ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>Revisa tu email</h2>
            <p style={{ color: "#94A3B8", fontSize: 14, lineHeight: 1.5 }}>
              Te enviamos un link mágico a <strong style={{ color: "#fff" }}>{email}</strong>.
              Haz click y entras directo.
            </p>
            <button
              onClick={() => setStatus("idle")}
              style={{ marginTop: 20, color: "#3B82F6", fontSize: 13 }}
            >
              Usar otro email
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Bienvenido</h1>
            <p style={{ color: "#94A3B8", fontSize: 14, marginBottom: 24 }}>
              Ingresa tu email y te mandamos un link para entrar.
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
                marginBottom: 16,
              }}
            />

            <button
              type="submit"
              disabled={status === "sending"}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "linear-gradient(135deg, #3B82F6, #818CF8)",
                borderRadius: 12,
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                opacity: status === "sending" ? 0.6 : 1,
              }}
            >
              {status === "sending" ? "Enviando..." : "Enviar link mágico"}
            </button>

            {err && (
              <div style={{
                marginTop: 12, padding: 12, borderRadius: 8,
                background: "rgba(239,68,68,0.1)", color: "#F87171", fontSize: 13,
              }}>{err}</div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
