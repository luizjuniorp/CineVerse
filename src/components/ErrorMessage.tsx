export function ErrorMessage({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-xl border border-red-500/30 bg-red-950/40 p-5 text-red-200">
      {message}
    </div>
  );
}
