import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";

type BackLinkProps = {
  href: string;

  label: string;
};

export default function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="text-muted hover:bg-tint hover:text-foreground -ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold transition-colors"
    >
      <ArrowLeftIcon className="size-4" />
      {label}
    </Link>
  );
}
