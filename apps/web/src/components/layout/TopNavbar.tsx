import { Search, Menu } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { NotificationDropdown } from '../ui/NotificationDropdown';

interface TopNavbarProps {
  onMenuClick: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick }) => {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-gray-800/50 bg-[#0f0f1a]/80 backdrop-blur-xl sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="hidden md:flex relative w-64 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-800 rounded-lg leading-5 bg-black/20 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-all"
            placeholder="Search cases, customers..."
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <NotificationDropdown />
        <div className="h-8 w-px bg-gray-800 mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium text-white">Merchant Inc.</div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
          <Avatar alt="User avatar" fallback="M" src="https://i.pravatar.cc/150?u=admin" />
        </div>
      </div>
    </header>
  );
};
