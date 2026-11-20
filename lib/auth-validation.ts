// Validările formularelor de cont (#53), verificate în browser înainte de trimitere.
// Backend-ul (backend/auth.ts) verifică din nou și traduce erorile Supabase.

export const MIN_PASSWORD_LENGTH = 8;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Scrie adresa de email.";
  if (!EMAIL_PATTERN.test(email.trim())) return "Adresa de email nu este validă.";
  return undefined;
}

export type LoginFields = "email" | "password";

export function validateLogin(values: Record<LoginFields, string>): FieldErrors<LoginFields> {
  const errors: FieldErrors<LoginFields> = {};
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;
  if (!values.password) errors.password = "Scrie parola.";
  return errors;
}

export type RegisterFields = "username" | "email" | "password" | "confirmPassword";

export function validateRegister(
  values: Record<RegisterFields, string>,
): FieldErrors<RegisterFields> {
  const errors: FieldErrors<RegisterFields> = {};
  if (!values.username.trim()) errors.username = "Scrie un nume de utilizator.";
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;
  if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Parola trebuie să aibă cel puțin ${MIN_PASSWORD_LENGTH} caractere.`;
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = "Scrie parola încă o dată.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Parolele nu coincid.";
  }
  return errors;
}

/** Mesaj pentru cazul în care serverul nu poate fi contactat (fără conexiune). */
export const NETWORK_ERROR =
  "Nu s-a putut contacta serverul. Verifică conexiunea la internet și încearcă din nou.";
