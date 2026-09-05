import { useState } from 'react';
import { Search, Menu, Command } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { NotificationDropdown } from '../ui/NotificationDropdown';
import { Badge } from '../ui/Badge';

interface TopNavbarProps {
  onMenuClick: () => void;
  onSearch?: (query: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick, onSearch }) => {
  const [query, setQuery] = useState('');

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-border/80 bg-white/75 backdrop-blur-xl sticky top-0 z-10">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-ink-muted hover:text-ink hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="relative w-full max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-muted group-focus-within:text-primary transition-colors">
            <Search size={16} />
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch?.(e.target.value);
            }}
            className="input-field pl-10 pr-16 py-2 bg-slate-50/80 border-transparent hover:border-border focus:bg-white"
            placeholder="Search cases, customers, payments…"
            aria-label="Global search"
          />
          <kbd className="hidden sm:flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-border bg-white text-[10px] text-ink-muted font-medium">
            <Command size={10} />K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4">
        <Badge variant="success" className="hidden sm:inline-flex gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Systems online
        </Badge>
        <NotificationDropdown />
        <div className="h-8 w-px bg-border mx-1" />
        <div className="flex items-center gap-2.5">
          <div className="hidden md:block text-right">
            <div className="text-sm font-semibold text-ink leading-tight">Merchant Inc.</div>
            <div className="text-[11px] text-ink-muted">Admin · INR</div>
          </div>
          <Avatar alt="Merchant admin" fallback="M" src="https://i.pravatar.cc/150?u=admin" />
        </div>
      </div>
    </header>
  );
};
