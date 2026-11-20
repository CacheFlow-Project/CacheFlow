"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/backend/auth";
import Button from "@/components/Button";
import FormAlert from "@/components/FormAlert";
import FormField from "@/components/FormField";
import {
  type FieldErrors,
  type LoginFields,
  NETWORK_ERROR,
  validateLogin,
} from "@/lib/auth-validation";

export default function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState<Record<LoginFields, string>>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors<LoginFields>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  function update(field: LoginFields, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    // Eroarea câmpului dispare imediat ce utilizatorul îl corectează.
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const validation = validateLogin(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setPending(true);
    try {
      const result = await signIn(values.email.trim(), values.password);
      if (result.success) {
        // După login se ajunge în Acasă; refresh ca proxy-ul să vadă sesiunea nouă.
        router.replace("/");
        router.refresh();
        return;
      }
      setFormError(result.error);
    } catch {
      setFormError(NETWORK_ERROR);
    }
    setPending(false);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      {formError && <FormAlert message={formError} />}
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
        autoComplete="current-password"
        value={values.password}
        error={errors.password}
        onChange={(event) => update("password", event.target.value)}
      />
      <Button type="submit" className="mt-2 w-full" disabled={pending}>
        {pending ? "Se verifică…" : "Intră în cont"}
      </Button>
      <p className="text-muted text-center text-sm">
        Nu ai cont?{" "}
        <Link href="/inregistrare" className="text-primary font-semibold underline">
          Creează unul
        </Link>
      </p>
    </form>
  );
}
