export const EmptyState = ({ title, description, icon: Icon }: { title: string, description: string, icon: any }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4 text-gray-500">
      <Icon size={32} />
    </div>
    <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
    <p className="text-gray-400 max-w-sm">{description}</p>
  </div>
);

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
