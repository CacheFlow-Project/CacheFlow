import type { Metadata } from "next";
import Card from "@/components/Card";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Intră în cont · CacheFlow",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
      <h1 className="text-3xl font-bold">Intră în cont</h1>
      <p className="text-muted mt-2">Continuă de unde ai rămas.</p>
      <Card className="mt-6">
        <LoginForm />
      </Card>
    </main>
  );
}
