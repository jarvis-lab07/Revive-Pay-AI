export const SkeletonCard = () => (
  <div className="surface p-5 h-full animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full skeleton-shimmer" />
        <div>
          <div className="w-24 h-4 skeleton-shimmer rounded mb-2" />
          <div className="w-16 h-3 skeleton-shimmer rounded" />
        </div>
      </div>
      <div className="w-16 h-6 skeleton-shimmer rounded-md" />
    </div>
    <div className="w-full h-24 skeleton-shimmer rounded-xl mb-4" />
    <div className="space-y-2">
      <div className="w-full h-10 skeleton-shimmer rounded-xl" />
      <div className="w-full h-10 skeleton-shimmer rounded-xl" />
    </div>
  </div>
);

export const SkeletonList = ({ count = 4 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </>
);
