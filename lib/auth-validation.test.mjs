// Teste unitare pentru validările formularelor de cont (#53). Rulare: npm test
// Folosesc runner-ul inclus în Node (node:test), fără pachete în plus.
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateEmail, validateLogin, validateRegister } from "./auth-validation.ts";

const VALID_REGISTER = {
  username: "Ana",
  email: "ana@exemplu.ro",
  password: "parola123",
  confirmPassword: "parola123",
};

test("emailul gol sau fără @ / domeniu nu e acceptat", () => {
  assert.equal(validateEmail(""), "Scrie adresa de email.");
  assert.equal(validateEmail("   "), "Scrie adresa de email.");
  assert.equal(validateEmail("ana"), "Adresa de email nu este validă.");
  assert.equal(validateEmail("ana@exemplu"), "Adresa de email nu este validă.");
});

test("un email valid trece, chiar cu spații la capete", () => {
  assert.equal(validateEmail("ana@exemplu.ro"), undefined);
  assert.equal(validateEmail("  ana@exemplu.ro  "), undefined);
});

test("login: ambele câmpuri goale dau câte o eroare", () => {
  assert.deepEqual(validateLogin({ email: "", password: "" }), {
    email: "Scrie adresa de email.",
    password: "Scrie parola.",
  });
});

test("login: date complete nu dau erori", () => {
  assert.deepEqual(validateLogin({ email: "ana@exemplu.ro", password: "x" }), {});
});

test("înregistrare: date valide nu dau erori", () => {
  assert.deepEqual(validateRegister(VALID_REGISTER), {});
});

test("înregistrare: parola trebuie să aibă minimum 8 caractere", () => {
  const errors = validateRegister({
    ...VALID_REGISTER,
    password: "1234567",
    confirmPassword: "1234567",
  });
  assert.equal(errors.password, "Parola trebuie să aibă cel puțin 8 caractere.");
  const ok = validateRegister({
    ...VALID_REGISTER,
    password: "12345678",
    confirmPassword: "12345678",
  });
  assert.equal(ok.password, undefined);
});

test("înregistrare: parolele care nu coincid sunt semnalate", () => {
  const errors = validateRegister({ ...VALID_REGISTER, confirmPassword: "altceva1" });
  assert.equal(errors.confirmPassword, "Parolele nu coincid.");
});

test("înregistrare: numele format doar din spații nu e acceptat", () => {
  const errors = validateRegister({ ...VALID_REGISTER, username: "   " });
  assert.equal(errors.username, "Scrie un nume de utilizator.");
});
