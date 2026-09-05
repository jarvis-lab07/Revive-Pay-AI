import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Users, ShieldAlert, Settings, CircleDollarSign } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Recovery Center', path: '/recovery', icon: Activity },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Audit Trail', path: '/audit', icon: ShieldAlert },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-[260px] flex-shrink-0 hidden md:flex flex-col border-r border-border/80 bg-white/80 backdrop-blur-xl z-20">
      <div className="h-16 flex items-center px-5 border-b border-border/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft">
            <CircleDollarSign className="text-white" size={18} />
          </div>
          <div>
            <div className="font-display font-semibold text-ink text-lg leading-none tracking-tight">RecoverAI</div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-ink-muted mt-0.5">Revenue Ops</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto" aria-label="Main">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Workspace</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? 'nav-active'
                    : 'text-ink-muted hover:text-ink hover:bg-slate-50'
                }`
              }
            >
              <Icon size={18} strokeWidth={1.75} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/80">
        <div className="surface-muted p-3 rounded-xl">
          <p className="text-xs font-semibold text-ink">Recovery health</p>
          <p className="text-[11px] text-ink-muted mt-1 leading-relaxed">63% success rate this period. 14 cases need review.</p>
          <div className="mt-2.5 h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full w-[63%] rounded-full bg-primary transition-all duration-700" />
          </div>
        </div>
      </div>
    </aside>
  );
};
