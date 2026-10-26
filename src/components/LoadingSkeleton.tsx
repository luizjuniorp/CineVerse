interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 6 }: LoadingSkeletonProps) {
  return (
    <div
      aria-label="Carregando títulos"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[2/3] rounded-xl bg-zinc-800" />
          <div className="mt-3 h-4 w-3/4 rounded bg-zinc-800" />
          <div className="mt-2 h-3 w-1/3 rounded bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}
