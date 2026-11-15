"use client";

/**
 * Pagină de TEST TEMPORARĂ pentru autentificare (#74).
 *
 * Scop: echipa poate verifica manual signUp / signIn / signOut / getCurrentUser,
 * până când frontend-ul face ecranele reale.
 *
 * Cum se rulează:
 *   1. Ai nevoie de `.env.local` cu NEXT_PUBLIC_SUPABASE_URL și NEXT_PUBLIC_SUPABASE_ANON_KEY.
 *   2. `npm run dev`
 *   3. Deschide http://localhost:3000/test-auth
 *   4. Completează nume/email/parolă → Înregistrare → Login → „Cine sunt?" → Logout.
 *
 * ⚠️ FRONTEND (#53): aceasta NU este interfața finală. Trebuie ÎNLOCUITĂ cu ecranele
 * reale `/login` și `/inregistrare` (cu design, validări, UX). Folosiți-o doar ca
 * referință pentru cum se apelează funcțiile din `@/backend/auth`.
 */

import { useState } from "react";
import { signUp, signIn, signOut, getCurrentUser } from "@/backend/auth";

export default function TestAuthPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignUp() {
    const result = await signUp(username, email, password);
    setMessage(result.success ? "Înregistrare reușită." : `Eroare: ${result.error}`);
  }

  async function handleSignIn() {
    const result = await signIn(email, password);
    setMessage(result.success ? "Login reușit." : `Eroare: ${result.error}`);
  }

  async function handleSignOut() {
    const result = await signOut();
    setMessage(result.success ? "Deconectat." : `Eroare: ${result.error}`);
  }

  async function handleWhoAmI() {
    const user = await getCurrentUser();
    setMessage(user ? `Logat ca: ${user.email}` : "Nimeni logat (null).");
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="text-2xl font-bold">Test autentificare (temporar)</h1>
      <div className="mt-4 flex flex-col gap-3">
        <input
          className="rounded border px-3 py-2"
          placeholder="Nume utilizator"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="rounded border px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="rounded border px-3 py-2"
          placeholder="Parolă"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <button className="rounded bg-black px-4 py-2 text-white" onClick={handleSignUp}>
            Înregistrare
          </button>
          <button className="rounded bg-black px-4 py-2 text-white" onClick={handleSignIn}>
            Login
          </button>
          <button className="rounded bg-black px-4 py-2 text-white" onClick={handleSignOut}>
            Logout
          </button>
          <button className="rounded border px-4 py-2" onClick={handleWhoAmI}>
            Cine sunt?
          </button>
        </div>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </div>
    </main>
  );
}
