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
      <div className="h-16 flex items-center px-6 border-b border-[#E8E5DF] flex-shrink-0 bg-[#F5F4F3]">
        <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-[#262420]">
          <div className="bg-[#A49A87] text-[#1C1A17] p-2 rounded-lg shadow-sm">
            <Scissors className="w-5 h-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="tracking-tight text-[#262420]">Zenyme</span>
            <span className="text-[10px] text-[#968F83] font-normal tracking-wide mt-0.5">Salon & Freelance SaaS</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto bg-[#F9F8F6]">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const isFreelancerItem = item.href === '/freelancer';
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-[#E8E5DF] text-[#2C2923] shadow-xs font-semibold border-l-4 border-[#A49A87]'
                  : 'text-[#605B52] hover:text-[#1A1916] hover:bg-[#E8E5DF]/60',
                isFreelancerItem && !isActive && 'text-[#555543] font-semibold bg-[#A5A58D]/15 hover:bg-[#A5A58D]/25'
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive ? 'text-[#8C8270]' : isFreelancerItem ? 'text-[#8C8C72]' : 'text-[#968F83]')} />
              <span>{item.name}</span>
              {isFreelancerItem && (
                <span className="ml-auto bg-[#A5A58D]/25 text-[#3C3C2E] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">New</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#E8E5DF] flex-shrink-0 bg-[#F5F4F3]">
        <div className="flex items-center gap-3 px-2 py-2 bg-white rounded-lg border border-[#E8E5DF] shadow-xs">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
            activeRole === 'freelancer' ? 'bg-[#A5A58D]/25 text-[#3C3C2E]' : 'bg-[#A49A87]/25 text-[#2C2923]'
          }`}>
            {activeRole === 'freelancer' ? currentStaff.name.charAt(0) : 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#262420] truncate leading-none">
              {activeRole === 'freelancer' ? currentStaff.name : 'Admin User'}
            </p>
            <p className="text-[10px] text-[#7C756A] truncate mt-1 leading-none">
              {activeRole === 'freelancer' ? `Stylist (${currentStaff.commissionRate}% split)` : 'Salon Administrator'}
            </p>
          </div>
        </div>
        <Link
          href="/login"
          className="mt-3 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#605B52] hover:text-[#1A1916] hover:bg-[#E8E5DF]/60 transition-colors w-full"
        >
          <LogOut className="w-4 h-4 text-[#968F83]" />
          Logout
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-screen bg-[#F9F8F6] text-[#262420] font-sans overflow-hidden">
      {/* Top Interactive Role Switcher Bar */}
      <RoleSwitcherBar />

      <div className="flex flex-1 min-h-0 relative">
        {/* ── Mobile overlay backdrop ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-[#1A1916]/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── Mobile drawer sidebar ── */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E8E5DF] flex flex-col transition-transform duration-300 ease-in-out lg:hidden',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {/* Close button for mobile drawer */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-1.5 text-[#968F83] hover:text-[#262420] rounded-md hover:bg-[#E8E5DF]/50 transition-colors z-10"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
          {sidebarContent}
        </aside>

        {/* ── Desktop static sidebar ── */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-[#E8E5DF] flex-col flex-shrink-0">
          {sidebarContent}
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* Mobile top bar with hamburger */}
          <div className="lg:hidden flex items-center h-14 px-4 border-b border-[#E8E5DF] bg-white flex-shrink-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-1 text-[#605B52] hover:text-[#1A1916] hover:bg-[#E8E5DF]/60 rounded-lg transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/dashboard" className="flex items-center gap-2 ml-3 text-lg font-bold text-[#262420]">
              <div className="bg-[#A49A87] text-[#1C1A17] p-1.5 rounded-md">
                <Scissors className="w-4 h-4" />
              </div>
              <span>Zenyme</span>
            </Link>
          </div>

          <main className="flex-1 overflow-y-auto flex flex-col bg-[#F9F8F6]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

