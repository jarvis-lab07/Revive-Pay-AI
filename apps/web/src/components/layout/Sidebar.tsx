import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Users, ShieldAlert, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Recovery Center', path: '/recovery', icon: Activity },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Audit Trail', path: '/audit', icon: ShieldAlert },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-gray-800/50 bg-[#0f0f1a]/80 backdrop-blur-xl z-20">
      <div className="h-16 flex items-center px-6 border-b border-gray-800/50">
        <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white text-lg">R</span>
          </div>
          RecoverAI
        </div>
      </div>
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};
