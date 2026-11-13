"use server";

import { createClient } from "@/lib/supabase/server";

type AuthResult = { success: true } | { success: false; error: string };

/** Traduce mesajele de eroare Supabase în mesaje clare în română (pentru #53). */
function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) {
    return "Email sau parolă greșite.";
  }
  if (m.includes("already registered") || m.includes("already been registered")) {
    return "Există deja un cont cu acest email.";
  }
  if (m.includes("password should be at least")) {
    return "Parola trebuie să aibă cel puțin 6 caractere.";
  }
  if (m.includes("email not confirmed")) {
    return "Emailul nu a fost confirmat. Verifică-ți inboxul.";
  }
  if (m.includes("invalid email") || m.includes("unable to validate email")) {
    return "Adresa de email nu este validă.";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "Prea multe încercări. Încearcă din nou mai târziu.";
  }
  return "A apărut o eroare. Încearcă din nou.";
}

/**
 * Înregistrează un cont nou. Username-ul este trimis în metadata, de unde triggerul
 * din #45 creează rândul din `profiles`.
 */
export async function signUp(
  username: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  if (!username.trim()) {
    return { success: false, error: "Numele de utilizator este obligatoriu." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username: username.trim() } },
  });

  if (error) {
    return { success: false, error: translateAuthError(error.message) };
  }
  return { success: true };
}

/** Autentifică un utilizator existent. */
export async function signIn(email: string, password: string): Promise<AuthResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: translateAuthError(error.message) };
  }
  return { success: true };
}

/** Deconectează utilizatorul curent. */
export async function signOut(): Promise<AuthResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: translateAuthError(error.message) };
  }
  return { success: true };
}

/**
 * Întoarce utilizatorul curent din sesiune, sau `null` dacă nu e autentificat.
 * Folosită de celelalte acțiuni și de ecrane pentru a verifica sesiunea.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
