type FormAlertProps = {
  message: string;
};

// Eroarea generală a formularului (de exemplu „Email sau parolă greșite.”).
export default function FormAlert({ message }: FormAlertProps) {
  return (
    <p role="alert" className="border-wrong bg-wrong-soft text-wrong rounded-lg border p-3 text-sm">
      {message}
    </p>
  );
}
