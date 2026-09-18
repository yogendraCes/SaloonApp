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
    <div className="bg-[#1C1A17] text-[#E8E5DF] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md border-b border-[#968F83]/20 text-xs z-50">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-[#A49A87]/20 border border-[#A49A87]/30 text-[#E8E5DF] px-2.5 py-1 rounded-full font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#A49A87]" />
          <span>Interactive Role Demo</span>
        </div>
        <span className="hidden md:inline-flex items-center gap-1 bg-[#A5A58D]/20 border border-[#A5A58D]/30 text-[#A5A58D] px-2 py-0.5 rounded text-[10px] font-medium">
          Public Demo • Open Access
        </span>
        <span className="hidden lg:inline text-[#968F83]">Switch workspace view:</span>
      </div>

      <div className="flex items-center flex-wrap gap-2">
        {/* Salon Owner Admin Toggle */}
        <button
          type="button"
          onClick={() => handleRoleChange('admin')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeRole === 'admin' && pathname !== '/book'
              ? 'bg-[#A49A87] text-[#1C1A17] shadow-sm ring-1 ring-[#A49A87]'
              : 'bg-white/10 hover:bg-white/20 text-[#E8E5DF]'
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
                ? 'bg-[#A5A58D] text-[#1C1A17] shadow-sm ring-1 ring-[#A5A58D]'
                : 'text-[#E8E5DF] hover:text-white'
            }`}
          >
            <Scissors className="w-3.5 h-3.5 text-[#A5A58D]" />
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
              className="bg-transparent text-[#E8E5DF] text-xs font-semibold focus:outline-none cursor-pointer py-1 pr-2"
            >
              {staff.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#1C1A17] text-[#E8E5DF]">
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
              ? 'bg-[#968F83] text-[#1C1A17] shadow-sm ring-1 ring-[#968F83]'
              : 'bg-white/10 hover:bg-white/20 text-[#E8E5DF]'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5 text-[#E8E5DF]" />
          <span>Client Booking App</span>
        </button>
      </div>
    </div>
  );
}
