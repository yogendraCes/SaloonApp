'use client';

import { useStore, type Service, type Staff } from '@/store/useStore';
import { SALON_CONFIG } from '@/config/salon.config';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Scissors,
  Clock,
  CheckCircle2,
  Sparkles,
  Star,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  Building2,
  Phone,
  Calendar,
  User,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function hasConflict(startA: string, durA: number, startB: string, durB: number): boolean {
  const a1 = toMinutes(startA);
  const a2 = a1 + durA;
  const b1 = toMinutes(startB);
  const b2 = b1 + durB;
  return a1 < b2 && b1 < a2;
}

function BookingWizard() {
  const searchParams = useSearchParams();
  const { services, staff, appointments, addAppointment, addCustomer, customers } = useStore();

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

  // Read URL query params on mount to pre-select staff or service
  useEffect(() => {
    const staffIdParam = searchParams.get('staff');
    const serviceIdParam = searchParams.get('service');

    if (staffIdParam) {
      const foundStaff = staff.find((s) => s.id === staffIdParam);
      if (foundStaff) {
        setSelectedStaff(foundStaff);
      }
    }

    if (serviceIdParam) {
      const foundService = services.find((s) => s.id === serviceIdParam);
      if (foundService) {
        setSelectedService(foundService);
        // If service is pre-selected, go directly to step 2 (choose stylist)
        setStep(2);
      }
    }
  }, [searchParams, staff, services]);

  // Standard salon time slots
  const TIME_SLOTS = [
    '10:00', '10:45', '11:30', '12:15', '13:00',
    '14:00', '14:45', '15:30', '16:15', '17:00',
    '17:45', '18:30', '19:15', '20:00'
  ];

  // Next 7 days
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

  // Double-booking collision detector
  const isSlotBooked = (slotTime: string): boolean => {
    if (!selectedStaff || !selectedService) return false;
    const durA = selectedService.duration || 30;

    return appointments.some((existing) => {
      if (existing.staffId !== selectedStaff.id) return false;
      if (existing.date !== selectedDate) return false;
      if (existing.status === 'cancelled') return false;

      const existingService = services.find((s) => s.id === existing.serviceId);
      const durB = existingService?.duration || 30;
      return hasConflict(slotTime, durA, existing.startTime, durB);
    });
  };

  // Check if slot has already passed for today
  const isSlotInPast = (slotTime: string): boolean => {
    const todayStr = new Date().toLocaleDateString('en-CA');
    if (selectedDate !== todayStr) return false;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return toMinutes(slotTime) <= currentMinutes;
  };

  // If currently selected time becomes unavailable when date/stylist changes, auto-pick first available
  useEffect(() => {
    if (isSlotBooked(selectedTime) || isSlotInPast(selectedTime)) {
      const firstAvailable = TIME_SLOTS.find(
        (t) => !isSlotBooked(t) && !isSlotInPast(t)
      );
      if (firstAvailable) {
        setSelectedTime(firstAvailable);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedStaff, selectedService]);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedStaff) return;

    if (isSlotBooked(selectedTime)) {
      alert('This time slot has just been booked. Please select an available slot.');
      return;
    }

    const existingCustomer = customers.find(
      (c) => c.phone === customerPhone || (customerEmail && c.email === customerEmail)
    );
    let customerId = existingCustomer?.id;

    if (!existingCustomer) {
      customerId = `c-${Date.now()}`;
      addCustomer({
        id: customerId,
        name: customerName,
        phone: customerPhone,
        email: customerEmail || '',
        lastVisit: selectedDate,
      });
    }

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
      alert('This slot is already booked for this stylist. Please pick another time slot.');
    }
  };

  // Formatted WhatsApp text
  const whatsAppMessage = encodeURIComponent(
    `Hello ${SALON_CONFIG.name}! ✂️\n\nI just scheduled an appointment via your website:\n` +
      `• Service: ${selectedService?.name} (₹${selectedService?.price})\n` +
      `• Stylist: ${selectedStaff?.name}\n` +
      `• Date: ${selectedDate}\n` +
      `• Time: ${selectedTime}\n` +
      `• Customer: ${customerName} (${customerPhone})\n` +
      (notes ? `• Notes: ${notes}\n` : '') +
      `\nPlease confirm my booking. Looking forward!`
  );

  const whatsAppLink = `https://wa.me/${SALON_CONFIG.contact.whatsappNumber}?text=${whatsAppMessage}`;

  return (
    <div className="min-h-screen bg-[#1C1A17] text-[#E8E5DF] font-sans pb-16">
      {/* ── Public Header ── */}
      <header className="border-b border-[#968F83]/30 bg-[#1C1A17]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-lg font-bold text-[#E8E5DF] group">
            <div className="bg-gradient-to-tr from-[#A49A87] to-[#A5A58D] text-[#1C1A17] p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5 text-[#1C1A17] stroke-[2.5]" />
            </div>
            <div>
              <span className="tracking-tight text-[#E8E5DF] block leading-tight">{SALON_CONFIG.shortName}</span>
              <span className="text-[10px] text-[#A49A87] font-medium tracking-widest uppercase">Online Booking</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-[#968F83] hover:text-[#E8E5DF] transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/dashboard"
              className="text-xs text-[#CCC8C3] hover:text-[#E8E5DF] flex items-center gap-1.5 font-medium bg-[#262420] hover:bg-[#332F2A] px-3 py-1.5 rounded-lg border border-[#968F83]/40 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-[#A49A87]" />
              <span>Staff Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress Stepper (Hidden on Submitted) */}
        {!isSubmitted && (
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-md mx-auto mb-3">
              {[
                { num: 1, label: 'Service' },
                { num: 2, label: 'Stylist' },
                { num: 3, label: 'Date & Time' },
                { num: 4, label: 'Details' },
              ].map((s) => (
                <div key={s.num} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      step >= s.num
                        ? 'bg-[#A49A87] text-[#1C1A17] shadow-md shadow-[#A49A87]/20'
                        : 'bg-[#262420] text-[#968F83] border border-[#968F83]/30'
                    }`}
                  >
                    {s.num}
                  </div>
                  <span
                    className={`text-[11px] mt-1 font-medium ${
                      step >= s.num ? 'text-[#A49A87]' : 'text-[#968F83]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-[#262420] h-1 rounded-full overflow-hidden max-w-md mx-auto">
              <div
                className="bg-gradient-to-r from-[#A49A87] to-[#A5A58D] h-full transition-all duration-300"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Confirmation Screen ── */}
        {isSubmitted ? (
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300 shadow-2xl">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white">Appointment Scheduled!</h2>
              <p className="text-slate-400 text-sm">
                We&apos;ve reserved your slot with <span className="text-amber-400 font-semibold">{selectedStaff?.name}</span> at {SALON_CONFIG.name}.
              </p>
            </div>

            {/* Booking Summary Box */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Service:</span>
                <span className="font-bold text-white">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Master Stylist:</span>
                <span className="font-bold text-amber-400">{selectedStaff?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Date & Time:</span>
                <span className="font-bold text-white">{selectedDate} at {selectedTime}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Client:</span>
                <span className="font-medium text-white">{customerName} ({customerPhone})</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Estimated Total:</span>
                <span className="font-extrabold text-amber-400 text-lg">₹{selectedService?.price}</span>
              </div>
            </div>

            {/* 1-Click WhatsApp Instant Confirmation Button */}
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Confirmation</span>
              </div>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Send your booking summary directly to our salon WhatsApp concierge with 1-click for instant confirmation and priority seating.
              </p>
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-emerald-900/40 text-sm"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Send Booking to Salon WhatsApp</span>
              </a>
            </div>

            {/* Anti-Clash Reassurance */}
            <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Your time slot is securely locked in the salon calendar.</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setStep(1);
                  setSelectedService(null);
                  setSelectedStaff(null);
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors text-sm"
              >
                Book Another Appointment
              </button>
              <Link
                href="/"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition-colors text-sm text-center flex items-center justify-center"
              >
                Back to Salon Website
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
            {/* STEP 1: Select Service */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Choose Your Service</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Select the signature cut, color, or spa treatment you desire.</p>
                  </div>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        selectedService?.id === service.id
                          ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 text-white'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-sm text-white">{service.name}</p>
                          <span className="text-sm font-extrabold text-amber-400">₹{service.price}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400/80" />
                          <span>{service.duration} mins</span>
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Includes consultation & wash</span>
                        <span className={`text-[11px] font-semibold ${selectedService?.id === service.id ? 'text-amber-400' : 'text-slate-500'}`}>
                          {selectedService?.id === service.id ? 'Selected ✓' : 'Select'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={!selectedService}
                  onClick={() => setStep(2)}
                  className="w-full mt-6 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
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
                  <div>
                    <h2 className="text-xl font-bold text-white">Choose Your Stylist</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Select a master artist or colorist for your appointment.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
                  {staff.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => setSelectedStaff(member)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedStaff?.id === member.id
                          ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 text-white'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-lg flex-shrink-0 border border-amber-500/30">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white">{member.name}</p>
                          <p className="text-xs text-slate-400">{member.role}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-semibold">{member.rating || 4.9}</span>
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
                  className="w-full mt-6 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <span>Continue to Select Date & Time</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 3: Select Date & Time (Anti-Collision Matrix) */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Select Date & Time Slot</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Stylist: <span className="text-amber-400 font-semibold">{selectedStaff?.name}</span> • Service: <span className="text-white">{selectedService?.name}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </button>
                </div>

                {/* Horizontal Date Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Choose Date</span>
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {availableDates.map((d) => (
                      <button
                        key={d.iso}
                        type="button"
                        onClick={() => setSelectedDate(d.iso)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          selectedDate === d.iso
                            ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/30'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <p className="text-[10px] uppercase font-bold">{d.dayName}</p>
                        <p className="text-lg font-extrabold my-0.5">{d.dayNum}</p>
                        <p className="text-[9px] text-slate-400">{d.month}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots Matrix with Live Collision Prevention */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Available Time Slots</span>
                    </label>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1 text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Available
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Booked / Passed
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {TIME_SLOTS.map((t) => {
                      const booked = isSlotBooked(t);
                      const passed = isSlotInPast(t);
                      const unavailable = booked || passed;
                      const selected = selectedTime === t;

                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={unavailable}
                          onClick={() => setSelectedTime(t)}
                          className={`relative py-3 px-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center ${
                            unavailable
                              ? 'bg-slate-950/70 border-rose-950/50 text-slate-500 cursor-not-allowed opacity-40'
                              : selected
                              ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400'
                              : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-amber-500/50 hover:bg-slate-900'
                          }`}
                        >
                          <span className={unavailable ? 'line-through' : ''}>{t}</span>
                          {booked && (
                            <span className="text-[8px] text-rose-400 font-bold uppercase tracking-wider mt-0.5">
                              Booked
                            </span>
                          )}
                          {passed && !booked && (
                            <span className="text-[8px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">
                              Passed
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-slate-500 italic mt-1">
                    * Red/disabled slots are already reserved by other clients or have passed to prevent overlapping visits.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isSlotBooked(selectedTime) || isSlotInPast(selectedTime)}
                  onClick={() => setStep(4)}
                  className="w-full mt-6 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <span>Continue to Client Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 4: Customer Details & Submit */}
            {step === 4 && (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Your Contact Details</h2>
                    <p className="text-xs text-slate-400 mt-0.5">We will send appointment reminders to this phone number.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </button>
                </div>

                {/* Summary Pill */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block">Selected:</span>
                    <span className="font-bold text-white">{selectedService?.name}</span>
                    <span className="text-slate-400"> with </span>
                    <span className="text-amber-400 font-semibold">{selectedStaff?.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block">Date & Time:</span>
                    <span className="font-bold text-white">{selectedDate} @ {selectedTime}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Phone Number (for WhatsApp Confirmation) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Special Requests / Hair Concerns (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      placeholder="e.g. Sensitive scalp, preferring low scissor fade, or reference style."
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Lock Appointment</span>
                </button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function PublicBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
          Loading booking experience...
        </div>
      }
    >
      <BookingWizard />
    </Suspense>
  );
}
