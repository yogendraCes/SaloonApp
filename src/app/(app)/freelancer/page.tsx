'use client';

import { useStore } from '@/store/useStore';
import {
  Wallet,
  Share2,
  Copy,
  Check,
  Calendar,
  Clock,
  Star,
  Award,
  Scissors,
  CheckCircle2,
  Sparkles,
  QrCode,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function FreelancerPortalPage() {
  const { activeStaffId, staff, appointments, services, customers } = useStore();
  const [copied, setCopied] = useState(false);

  const currentStylist = staff.find((s) => s.id === activeStaffId) || staff[0];

  // Appointments for this specific freelancer
  const stylistAppointments = appointments.filter((a) => a.staffId === currentStylist.id);

  // Financial calculations
  const completedApps = stylistAppointments.filter((a) => a.status === 'completed');
  
  const grossBilling = completedApps.reduce((sum, app) => {
    const service = services.find((s) => s.id === app.serviceId);
    return sum + (service?.price || 0);
  }, 0);

  const commissionEarned = Math.round((grossBilling * currentStylist.commissionRate) / 100);

  const totalTips = completedApps.reduce((sum, app) => sum + (app.tips || 0), 0);

  const boothRentTotal = currentStylist.boothRent; // daily rent

  const netTakeHome = commissionEarned + totalTips - (completedApps.length > 0 ? boothRentTotal : 0);

  const bookingLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/book?stylist=${currentStylist.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* ── Header Profile Banner ── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold text-2xl shadow-inner">
              {currentStylist.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{currentStylist.name}</h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Independent Contractor
                </span>
              </div>
              <p className="text-indigo-200 text-sm mt-1">{currentStylist.role}</p>
              
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-300 flex-wrap">
                <span className="flex items-center gap-1 text-amber-300 font-semibold">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  {currentStylist.rating || 4.9} Rating
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-indigo-300">
                  <Award className="w-4 h-4" />
                  {currentStylist.commissionRate}% Commission Split
                </span>
                <span>•</span>
                <span className="text-slate-400">
                  Daily Booth Rent: ₹{currentStylist.boothRent}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href={`/book?stylist=${currentStylist.id}`}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
            >
              <Scissors className="w-4 h-4" />
              Preview My Booking Link
            </Link>
          </div>
        </div>
      </div>

      {/* ── Financial Payout & Take-Home Breakdown ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-600" />
            Earnings & Take-Home Payout Calculator
          </h2>
          <span className="text-xs font-medium text-slate-500">Real-time revenue split</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Gross Revenue */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Revenue</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">₹{grossBilling.toLocaleString()}</p>
            <p className="text-[11px] text-slate-400 mt-1">{completedApps.length} completed services</p>
          </div>

          {/* Commission Share */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">My Share ({currentStylist.commissionRate}%)</p>
            <p className="text-2xl font-bold text-indigo-600 mt-2">₹{commissionEarned.toLocaleString()}</p>
            <p className="text-[11px] text-indigo-500 mt-1">Direct from services</p>
          </div>

          {/* Tips Earned */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Client Tips (100%)</p>
            <p className="text-2xl font-bold text-amber-600 mt-2">₹{totalTips.toLocaleString()}</p>
            <p className="text-[11px] text-amber-600 mt-1">100% kept by stylist</p>
          </div>

          {/* Booth Rent */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Booth Rent Fee</p>
            <p className="text-2xl font-bold text-rose-600 mt-2">-₹{boothRentTotal}</p>
            <p className="text-[11px] text-slate-400 mt-1">Daily chair rental</p>
          </div>

          {/* Net Take-Home Pay (Highlight) */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-5 rounded-xl text-white shadow-md sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Net Take-Home Pay
            </p>
            <p className="text-3xl font-extrabold mt-2">₹{netTakeHome.toLocaleString()}</p>
            <p className="text-[11px] text-emerald-100 mt-1 font-medium">Ready for payout</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left Column: Personal Schedule & Bookings ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">My Appointments & Clients</h3>
                <p className="text-xs text-slate-500 mt-0.5">Appointments assigned to {currentStylist.name}</p>
              </div>
              <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {stylistAppointments.length} Bookings
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {stylistAppointments.length > 0 ? (
                stylistAppointments.map((app) => {
                  const customer = customers.find((c) => c.id === app.customerId);
                  const service = services.find((s) => s.id === app.serviceId);
                  const servicePrice = service?.price || 0;
                  const stylistCut = Math.round((servicePrice * currentStylist.commissionRate) / 100);

                  return (
                    <div key={app.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                          {customer?.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-900">{customer?.name}</p>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                              app.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                            <span className="font-semibold text-slate-700">{service?.name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {app.startTime}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /> {app.date}</span>
                          </p>
                          {app.notes && (
                            <p className="text-xs italic text-slate-500 mt-1 bg-slate-100 px-2.5 py-1 rounded-md">
                              &quot;{app.notes}&quot;
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6 flex sm:flex-col justify-between items-end">
                        <div>
                          <p className="text-sm font-bold text-slate-900">₹{servicePrice.toLocaleString()}</p>
                          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                            Take-Home: ₹{stylistCut + (app.tips || 0)}
                          </p>
                        </div>
                        {app.tips ? (
                          <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200 mt-1">
                            +₹{app.tips} tip
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No appointments assigned to you yet. Share your booking link to get clients!
                </div>
              )}
            </div>
          </div>

          {/* Working Days & Schedule Setup */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2">My Availability & Schedule</h3>
            <p className="text-xs text-slate-500 mb-4">Days you are available for client bookings:</p>
            
            <div className="flex flex-wrap gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                const isWorking = currentStylist.workingDays?.includes(day);
                return (
                  <div
                    key={day}
                    className={`px-3 py-2 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all ${
                      isWorking
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${isWorking ? 'text-emerald-600' : 'text-slate-300'}`} />
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right Column: Shareable Booking Link & QR Code ── */}
        <div className="space-y-6">
          {/* Shareable Link Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 text-indigo-700 p-2.5 rounded-xl">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Direct Booking Link</h3>
                <p className="text-xs text-slate-500">Share on Instagram, WhatsApp, or business cards</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
              <input
                type="text"
                readOnly
                value={bookingLink}
                className="bg-transparent text-xs font-mono text-slate-700 truncate focus:outline-none flex-1"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* QR Code Simulation Card */}
            <div className="border border-dashed border-slate-200 bg-slate-50/50 p-5 rounded-xl text-center space-y-3">
              <div className="w-24 h-24 mx-auto bg-white border border-slate-200 rounded-lg p-2 flex flex-col items-center justify-center shadow-xs">
                <QrCode className="w-16 h-16 text-slate-800" />
                <span className="text-[9px] text-slate-400 font-mono mt-0.5">SCAN TO BOOK</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">Scan & Book Aisha</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Clients can scan to book directly</p>
              </div>
            </div>
          </div>

          {/* Freelancer Bio Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Stylist Bio & Specialties</h3>
            <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-100">
              &quot;{currentStylist.bio || 'Specialist in haircuts and coloring.'}&quot;
            </p>
            
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Top Services</p>
              <div className="flex flex-wrap gap-1.5">
                {currentStylist.specialties?.map((spec) => (
                  <span key={spec} className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
