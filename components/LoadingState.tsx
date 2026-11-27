type LoadingStateProps = {
  label?: string;
};

export default function LoadingState({ label = "Se încarcă…" }: LoadingStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 py-16 text-center"
    >
      <span
        aria-hidden="true"
        className="border-border border-t-primary size-10 animate-spin rounded-full border-4 motion-reduce:animate-none"
      />
      <p className="text-muted text-sm">{label}</p>
    </div>
  );
}
