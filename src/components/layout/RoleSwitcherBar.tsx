'use client';

import { useStore, type UserRole } from '@/store/useStore';
import { useRouter, usePathname } from 'next/navigation';
import { Building2, Scissors, CalendarCheck, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export function RoleSwitcherBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { activeRole, setActiveRole, activeStaffId, setActiveStaffId, staff } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'client') {
      router.push('/book');
    } else if (role === 'freelancer') {
      router.push('/freelancer');
    } else if (pathname === '/book' || pathname === '/freelancer') {
      router.push('/dashboard');
    }
  };

  return (
    <div className="bg-slate-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md border-b border-indigo-500/20 text-xs z-50">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-2.5 py-1 rounded-full font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Role Demo</span>
        </div>
        <span className="hidden sm:inline text-slate-400">Switch workspace view:</span>
      </div>

      <div className="flex items-center flex-wrap gap-2">
        {/* Salon Owner Admin Toggle */}
        <button
          type="button"
          onClick={() => handleRoleChange('admin')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeRole === 'admin' && pathname !== '/book'
              ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
              : 'bg-white/10 hover:bg-white/20 text-slate-300'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Salon Owner</span>
        </button>

        {/* Freelancer Stylist Toggle */}
        <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => handleRoleChange('freelancer')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
              activeRole === 'freelancer' && pathname !== '/book'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Scissors className="w-3.5 h-3.5 text-emerald-400" />
            <span>Freelancer Workspace</span>
          </button>

          {/* Active Stylist Picker Dropdown */}
          <div className="border-l border-white/20 pl-1 pr-1">
            <select
              value={activeStaffId}
              onChange={(e) => {
                setActiveStaffId(e.target.value);
                if (activeRole !== 'freelancer') {
                  handleRoleChange('freelancer');
                }
              }}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer py-1 pr-2"
            >
              {staff.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-slate-100">
                  {s.name.split(' ')[0]} ({s.commissionRate}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Client Booking Mode */}
        <button
          type="button"
          onClick={() => handleRoleChange('client')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            pathname === '/book'
              ? 'bg-rose-600 text-white shadow-sm ring-1 ring-rose-400'
              : 'bg-white/10 hover:bg-white/20 text-slate-300'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5 text-rose-400" />
          <span>Client Booking App</span>
        </button>
      </div>
    </div>
  );
}
