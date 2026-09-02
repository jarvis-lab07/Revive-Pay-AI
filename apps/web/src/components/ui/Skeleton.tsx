import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-[#161622] rounded-2xl p-6 border border-gray-800 h-full animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-800"></div>
        <div>
          <div className="w-24 h-4 bg-gray-800 rounded mb-2"></div>
          <div className="w-16 h-3 bg-gray-800 rounded"></div>
        </div>
      </div>
      <div className="w-16 h-6 bg-gray-800 rounded-full"></div>
    </div>
    <div className="w-full h-24 bg-gray-800/50 rounded-lg mb-4"></div>
    <div className="space-y-2">
      <div className="w-full h-10 bg-gray-800 rounded-lg"></div>
      <div className="w-full h-10 bg-gray-800 rounded-lg"></div>
    </div>
  </div>
);

export const SkeletonList = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
