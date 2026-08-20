'use client';

import { useStore, type Service, type Staff } from '@/store/useStore';
import { useState, useMemo } from 'react';
import {
  Scissors,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Sparkles,
  Star,
  Phone,
  Mail,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  Building2,
  Check,
} from 'lucide-react';
import Link from 'next/link';

export default function PublicBookingPage() {
  const { services, staff, addAppointment, addCustomer, customers } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toLocaleDateString('en-CA')
  );
  const [selectedTime, setSelectedTime] = useState<string>('10:00');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Time slots array
  const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '11:30', '12:30', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Dates for next 7 days
  const availableDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        iso: d.toLocaleDateString('en-CA'),
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
      };
    });
  }, []);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedStaff) return;

    // Check if customer exists or create new
    let existingCustomer = customers.find(
      (c) => c.phone === customerPhone || c.email === customerEmail
    );
    let customerId = existingCustomer?.id;

    if (!existingCustomer) {
      customerId = `c-${Date.now()}`;
      addCustomer({
        id: customerId,
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        lastVisit: selectedDate,
      });
    }

    // Add appointment to store
    const newAppointment = {
      id: `app-${Date.now()}`,
      customerId: customerId!,
      staffId: selectedStaff.id,
      serviceId: selectedService.id,
      date: selectedDate,
      startTime: selectedTime,
      status: 'scheduled' as const,
      notes: notes,
    };

    const success = addAppointment(newAppointment);
    if (success) {
      setIsSubmitted(true);
    } else {
      alert('Selected time slot is unavailable. Please select another time or stylist.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* ── Public Header ── */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold text-white">
            <div className="bg-gradient-to-tr from-indigo-600 to-rose-500 text-white p-2 rounded-xl shadow-md">
              <Scissors className="w-5 h-5" />
            </div>
            <span>Zenyme Studio</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="max-w-3xl mx-auto px-4 pt-8">
        {/* Salon Hero Badge */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            Instant Online Appointment Booking
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Book Your Beauty Experience
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Choose your service, preferred expert stylist, and instant time slot.
          </p>
        </div>

        {/* ── Success Confirmation Screen ── */}
        {isSubmitted ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300 shadow-2xl">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white">Booking Confirmed!</h2>
              <p className="text-slate-400 text-sm">
                We've scheduled your appointment with <span className="text-white font-semibold">{selectedStaff?.name}</span>.
              </p>
            </div>

            {/* Booking Summary Box */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Service:</span>
                <span className="font-bold text-white">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Stylist:</span>
                <span className="font-bold text-emerald-400">{selectedStaff?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Date & Time:</span>
                <span className="font-bold text-white">{selectedDate} at {selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Price:</span>
                <span className="font-extrabold text-indigo-400 text-base">₹{selectedService?.price}</span>
              </div>
            </div>

            {/* Simulated WhatsApp Notification Card */}
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Confirmation Sent</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed font-mono bg-slate-950/80 p-3 rounded-lg border border-emerald-900/50">
                "Hi {customerName}! Your booking for {selectedService?.name} with {selectedStaff?.name} on {selectedDate} at {selectedTime} is confirmed. Reply CANCEL to modify."
              </p>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setStep(1);
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors text-sm"
              >
                Book Another Appointment
              </button>
              <Link
                href="/dashboard"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors text-sm text-center"
              >
                View in Admin Calendar
              </Link>
            </div>
          </div>
        ) : (
          /* ── 4-Step Wizard Container ── */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Step Progress Header */}
            <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950 text-center text-xs font-semibold">
              {[
                { s: 1, label: 'Service' },
                { s: 2, label: 'Stylist' },
                { s: 3, label: 'Date & Time' },
                { s: 4, label: 'Details' },
              ].map(({ s, label }) => (
                <div
                  key={s}
                  className={`py-3 transition-colors ${
                    step === s
                      ? 'bg-indigo-600 text-white font-bold'
                      : step > s
                      ? 'bg-slate-900 text-emerald-400'
                      : 'text-slate-500'
                  }`}
                >
                  Step {s}: {label}
                </div>
              ))}
            </div>

            <div className="p-6 md:p-8">
              {/* STEP 1: Select Service */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-white">Select a Service</h2>
                  <div className="grid grid-cols-1 gap-3">
                    {services.map((srv) => (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedService(srv)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedService?.id === srv.id
                            ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-base text-white">{srv.name}</p>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {srv.duration} minutes
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-extrabold text-indigo-400">₹{srv.price}</span>
                          {selectedService?.id === srv.id && (
                            <Check className="w-5 h-5 text-indigo-400 ml-auto mt-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={!selectedService}
                    onClick={() => setStep(2)}
                    className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span>Continue to Select Stylist</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: Select Stylist */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Choose Your Freelance Stylist</h2>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Back
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {staff.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => setSelectedStaff(member)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedStaff?.id === member.id
                            ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/40 text-white'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg flex-shrink-0">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-white">{member.name}</p>
                            <p className="text-xs text-slate-400">{member.role}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-amber-300">
                              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                              <span>{member.rating || 4.9}</span>
                            </div>
                          </div>
                        </div>
                        {member.specialties && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {member.specialties.map((s) => (
                              <span key={s} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={!selectedStaff}
                    onClick={() => setStep(3)}
                    className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span>Continue to Select Date & Time</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 3: Select Date & Time */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Select Date & Time Slot</h2>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Back
                    </button>
                  </div>

                  {/* Horizontal Date Picker */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</label>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {availableDates.map((d) => (
                        <button
                          key={d.iso}
                          type="button"
                          onClick={() => setSelectedDate(d.iso)}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            selectedDate === d.iso
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <p className="text-[10px] uppercase font-bold">{d.dayName}</p>
                          <p className="text-lg font-extrabold my-0.5">{d.dayNum}</p>
                          <p className="text-[9px] text-slate-400">{d.month}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots Matrix */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Time Slot</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                      {TIME_SLOTS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          className={`py-2.5 rounded-lg border text-xs font-bold transition-all ${
                            selectedTime === t
                              ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span>Continue to Final Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 4: Customer Details & Submit */}
              {step === 4 && (
                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Your Contact Details</h2>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Back
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ananya Roy"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="ananya@example.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Special Requests / Notes
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific hairstyle reference or instructions..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-4 rounded-xl transition-all shadow-lg text-base"
                  >
                    Confirm & Complete Booking (₹{selectedService?.price})
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
