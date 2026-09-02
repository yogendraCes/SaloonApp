'use client';

import { useStore } from '@/store/useStore';
import { Download, CheckCircle2, FileText } from 'lucide-react';
import { useState } from 'react';

export default function BillingPage() {
  const { appointments, customers, services, updateAppointment } = useStore();
  const [generatedBillId, setGeneratedBillId] = useState<string | null>(null);

  const recentTransactions = appointments
    .filter(a => a.status === 'scheduled' || a.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.startTime.localeCompare(a.startTime))
    .map(a => {
      const customer = customers.find(c => c.id === a.customerId);
      const service = services.find(s => s.id === a.serviceId);
      return {
        id: a.id,
        date: a.date,
        customerName: customer?.name || 'Unknown',
        serviceName: service?.name || 'Unknown',
        amount: service?.price || 0,
        status: a.status === 'completed' ? 'Paid' : 'Pending',
      };
    });

  const totalRevenue = recentTransactions
    .filter(tx => tx.status === 'Paid')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const pendingPayments = recentTransactions
    .filter(tx => tx.status === 'Pending')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const completedCount = recentTransactions.filter(tx => tx.status === 'Paid').length;

  const handleGenerateBill = (id: string) => {
    updateAppointment(id, { status: 'completed' });
    setGeneratedBillId(id);
    setTimeout(() => {
      setGeneratedBillId(null);
    }, 3000);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Billing & Invoices</h1>
        <p className="text-slate-500 mt-1">Manage payments and view transaction history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 mt-2 font-bold uppercase tracking-tight">+15% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Payments</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">₹{pendingPayments.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-2 font-medium tracking-tight">{recentTransactions.filter(tx => tx.status === 'Pending').length} invoices pending</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Transactions</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{completedCount}</p>
          <p className="text-xs text-slate-400 mt-2 font-medium tracking-tight">All time</p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden relative">
        {generatedBillId && (
          <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg border border-emerald-100 shadow-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold text-sm">Bill generated successfully!</span>
          </div>
        )}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-3 md:px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="py-3 px-3 md:px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="py-3 px-3 md:px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Service</th>
                <th className="py-3 px-3 md:px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="py-3 px-3 md:px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-3 md:px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-3 px-3 md:px-6 text-sm text-slate-600 hidden sm:table-cell">{tx.date}</td>
                  <td className="py-3 px-3 md:px-6 text-sm font-semibold text-slate-900">{tx.customerName}</td>
                  <td className="py-3 px-3 md:px-6 text-sm text-slate-600 hidden md:table-cell">{tx.serviceName}</td>
                  <td className="py-3 px-3 md:px-6 text-sm font-bold text-slate-900">₹{tx.amount.toLocaleString()}</td>
                  <td className="py-3 px-3 md:px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      tx.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 md:px-6 text-right">
                    {tx.status === 'Paid' ? (
                      <button className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1 transition-colors">
                        <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Receipt</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleGenerateBill(tx.id)}
                        className="text-indigo-600 hover:text-indigo-900 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1 bg-indigo-50 px-2 md:px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Generate</span> Bill
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
