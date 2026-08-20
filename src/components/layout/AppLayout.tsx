'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  CreditCard,
  LogOut,
  Scissors,
  UserPlus,
  Briefcase,
  Menu,
  X,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoleSwitcherBar } from './RoleSwitcherBar';
import { useStore } from '@/store/useStore';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Freelancer Portal', href: '/freelancer', icon: Wallet },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Services', href: '/services', icon: Briefcase },
  { name: 'Staff', href: '/staff', icon: UserPlus },
  { name: 'Billing', href: '/billing', icon: CreditCard },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeRole, activeStaffId, staff } = useStore();

  const currentStaff = staff.find((s) => s.id === activeStaffId) || staff[0];

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const sidebarContent = (
    <>
      <div className="h-16 flex items-center px-6 border-b border-slate-200 flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-sm">
            <Scissors className="w-5 h-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span>Zenyme</span>
            <span className="text-[10px] text-slate-400 font-normal tracking-wide mt-0.5">Salon & Freelance SaaS</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const isFreelancerItem = item.href === '/freelancer';
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
                isFreelancerItem && !isActive && 'text-emerald-700 font-semibold bg-emerald-50/50 hover:bg-emerald-100/50'
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive ? 'text-indigo-700' : isFreelancerItem ? 'text-emerald-600' : 'text-slate-400')} />
              <span>{item.name}</span>
              {isFreelancerItem && (
                <span className="ml-auto bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">New</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 flex-shrink-0 bg-slate-50/50">
        <div className="flex items-center gap-3 px-2 py-2 bg-white rounded-lg border border-slate-200/80 shadow-xs">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
            activeRole === 'freelancer' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-700'
          }`}>
            {activeRole === 'freelancer' ? currentStaff.name.charAt(0) : 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate leading-none">
              {activeRole === 'freelancer' ? currentStaff.name : 'Admin User'}
            </p>
            <p className="text-[10px] text-slate-500 truncate mt-1 leading-none">
              {activeRole === 'freelancer' ? `Stylist (${currentStaff.commissionRate}% split)` : 'Salon Administrator'}
            </p>
          </div>
        </div>
        <Link
          href="/login"
          className="mt-3 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors w-full"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          Logout
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Top Interactive Role Switcher Bar */}
      <RoleSwitcherBar />

      <div className="flex flex-1 min-h-0 relative">
        {/* ── Mobile overlay backdrop ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── Mobile drawer sidebar ── */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:hidden',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {/* Close button for mobile drawer */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors z-10"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
          {sidebarContent}
        </aside>

        {/* ── Desktop static sidebar ── */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col flex-shrink-0">
          {sidebarContent}
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* Mobile top bar with hamburger */}
          <div className="lg:hidden flex items-center h-14 px-4 border-b border-slate-200 bg-white flex-shrink-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/dashboard" className="flex items-center gap-2 ml-3 text-lg font-bold text-slate-900">
              <div className="bg-indigo-600 text-white p-1.5 rounded-md">
                <Scissors className="w-4 h-4" />
              </div>
              <span>Zenyme</span>
            </Link>
          </div>

          <main className="flex-1 overflow-y-auto flex flex-col bg-slate-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

