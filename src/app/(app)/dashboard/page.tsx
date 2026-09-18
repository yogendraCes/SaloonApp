'use client';

import { useStore } from '@/store/useStore';
import { Users, Calendar, TrendingUp, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const { customers, appointments, services } = useStore();

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === today);

  const todayRevenue = todayAppointments
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => {
      const service = services.find(s => s.id === a.serviceId);
      return sum + (service?.price || 0);
    }, 0);

  const stats = [
    { name: 'Total Customers', value: customers.length, icon: Users, change: '+12%', changeType: 'positive' },
    { name: 'Appointments Today', value: todayAppointments.length, icon: Calendar, change: '+2', changeType: 'positive' },
    { name: 'Revenue Today', value: `₹${todayRevenue.toLocaleString()}`, icon: DollarSign, change: '+8%', changeType: 'positive' },
    { name: 'Growth', value: '24.5%', icon: TrendingUp, change: '+4.1%', changeType: 'positive' },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow-xs rounded-xl border border-[#E8E5DF] p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2.5 rounded-lg bg-[#E8E5DF]/60">
                <item.icon className="h-6 w-6 text-[#A49A87]" aria-hidden="true" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-[#7C756A] truncate">{item.name}</dt>
                  <dd>
                    <div className="text-2xl font-bold text-[#262420]">{item.value}</div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm font-semibold text-[#8C8C72]">
                {item.change}
              </span>
              <span className="text-xs text-[#968F83] ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-xs rounded-xl border border-[#E8E5DF] overflow-hidden">
        <div className="p-5 border-b border-[#E8E5DF] bg-[#F5F4F3]">
          <h2 className="text-lg font-bold text-[#262420]">Today&apos;s Appointments</h2>
        </div>
        <div className="p-5">
          {todayAppointments.length > 0 ? (
            <div className="space-y-3">
              {todayAppointments.map((app) => {
                const customer = customers.find(c => c.id === app.customerId);
                return (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-[#F9F8F6] rounded-xl border border-[#E8E5DF] hover:border-[#CCC8C3] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#E8E5DF] rounded-full flex items-center justify-center text-[#6F6656] font-bold text-sm border border-[#CCC8C3]">
                        {customer?.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#262420]">{customer?.name}</p>
                        <p className="text-[11px] text-[#7C756A] mt-0.5">{app.startTime}</p>
                      </div>
                    </div>
                    <div className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      app.status === 'completed' ? 'bg-[#A5A58D]/25 text-[#3C3C2E]' : 'bg-[#A49A87]/25 text-[#4B453A]'
                    }`}>
                      {app.status}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[#968F83] text-sm py-4">No appointments scheduled for today.</p>
          )}
        </div>
      </div>
    </div>
  );
}
