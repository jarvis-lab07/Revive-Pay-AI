import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { LayoutDashboard, Activity, Users, ShieldAlert, Settings, X, CircleDollarSign } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { DemoHelpers } from '../ui/DemoHelpers';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Recovery Center', path: '/recovery', icon: Activity },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Audit Trail', path: '/audit', icon: ShieldAlert },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const MainLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen app-shell text-ink overflow-hidden font-sans">
      <Sidebar />

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="fixed inset-y-0 left-0 w-72 bg-white border-r border-border z-40 md:hidden flex flex-col shadow-lift"
            >
              <div className="h-16 flex items-center justify-between px-5 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <CircleDollarSign className="text-white" size={18} />
                  </div>
                  <span className="font-display font-semibold text-lg text-ink">RecoverAI</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-ink-muted hover:text-ink rounded-xl hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                          isActive
                            ? 'nav-active'
                            : 'text-ink-muted hover:text-ink hover:bg-slate-50'
                        }`
                      }
                    >
                      <Icon size={18} />
                      {item.name}
                    </NavLink>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto page-enter">
            <Outlet />
          </div>
        </main>
      </div>

      {import.meta.env.DEV && <DemoHelpers />}
    </div>
  );
};
