"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { signUp } from "@/backend/auth";
import Button from "@/components/Button";
import FormAlert from "@/components/FormAlert";
import FormField from "@/components/FormField";
import {
  type FieldErrors,
  MIN_PASSWORD_LENGTH,
  NETWORK_ERROR,
  type RegisterFields,
  validateRegister,
} from "@/lib/auth-validation";

const EMPTY: Record<RegisterFields, string> = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<RegisterFields>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [sentTo, setSentTo] = useState("");

  function update(field: RegisterFields, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const validation = validateRegister(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setPending(true);
    try {
      const email = values.email.trim();
      const result = await signUp(values.username.trim(), email, values.password);
      if (result.success) {
        setSentTo(email);
      } else {
        setFormError(result.error);
      }
    } catch {
      setFormError(NETWORK_ERROR);
    }
    setPending(false);
  }

  // Contul e creat, dar Supabase cere confirmarea emailului înainte de primul login.
  if (sentTo) {
    return (
      <div role="status" className="flex flex-col gap-4">
        <div className="border-correct bg-correct-soft rounded-lg border p-4">
          <p className="text-correct font-semibold">Contul a fost creat</p>
          <p className="mt-1">
            Ți-am trimis un email de confirmare la <strong>{sentTo}</strong>. Deschide linkul din
            el, apoi intră în cont.
          </p>
        </div>
        <Link
          href="/login"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex min-h-11 w-full items-center justify-center rounded-lg px-5 py-2 font-semibold"
        >
          Mergi la login
        </Link>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      {formError && <FormAlert message={formError} />}
      <FormField
        id="nume"
        label="Nume de utilizator"
        autoComplete="username"
        value={values.username}
        error={errors.username}
        onChange={(event) => update("username", event.target.value)}
      />
      <FormField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        inputMode="email"
        value={values.email}
        error={errors.email}
        onChange={(event) => update("email", event.target.value)}
      />
      <FormField
        id="parola"
        label="Parolă"
        type="password"
        autoComplete="new-password"
        value={values.password}
        error={errors.password}
        onChange={(event) => update("password", event.target.value)}
      />
      {!errors.password && (
        <p className="text-muted -mt-2 text-sm">Minimum {MIN_PASSWORD_LENGTH} caractere.</p>
      )}
      <FormField
        id="confirmare-parola"
        label="Confirmă parola"
        type="password"
        autoComplete="new-password"
        value={values.confirmPassword}
        error={errors.confirmPassword}
        onChange={(event) => update("confirmPassword", event.target.value)}
      />
      <Button type="submit" className="mt-2 w-full" disabled={pending}>
        {pending ? "Se creează contul…" : "Creează contul"}
      </Button>
      <p className="text-muted text-center text-sm">
        Ai deja cont?{" "}
        <Link href="/login" className="text-primary font-semibold underline">
          Intră în cont
        </Link>
      </p>
    </form>
  );
}
