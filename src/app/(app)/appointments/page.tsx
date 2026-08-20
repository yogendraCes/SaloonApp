'use client';

import { useStore, type Appointment } from '@/store/useStore';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookingModal, AppointmentDetailModal } from '@/components/BookingModal';

const HOURS = Array.from({ length: 11 }, (_, i) => i + 9); // 9 AM to 7 PM
// px per minute — each hour row is h-24 = 96px → 96/60 = 1.6
const PX_PER_MIN = 1.6;

export default function AppointmentsPage() {
  const { staff, appointments, customers, services } = useStore();

  // Use local date so IST users don't land on yesterday
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ staffId: string; time: string } | null>(null);
  const [detailAppointment, setDetailAppointment] = useState<Appointment | null>(null);

  // YYYY-MM-DD in local timezone (fixes UTC shift for IST)
  const formattedDate = currentDate.toLocaleDateString('en-CA');

  const dayAppointments = useMemo(
    () => appointments.filter((a) => a.date === formattedDate),
    [appointments, formattedDate],
  );

  const groupedAppointments = useMemo(() => {
    const groups: Record<string, Appointment[]> = {};
    const sorted = [...dayAppointments].sort((a, b) => a.startTime.localeCompare(b.startTime));
    sorted.forEach((app) => {
      const [h, m] = app.startTime.split(':');
      const hour = parseInt(h, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      const timeLabel = `${hour12}:${m} ${ampm}`;
      
      if (!groups[timeLabel]) groups[timeLabel] = [];
      groups[timeLabel].push(app);
    });
    return groups;
  }, [dayAppointments]);

  const handlePrevDay = () => {
    setCurrentDate((d) => {
      const next = new Date(d);
      next.setDate(d.getDate() - 1);
      return next;
    });
  };

  const handleNextDay = () => {
    setCurrentDate((d) => {
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      return next;
    });
  };

  const handleToday = () => setCurrentDate(new Date());

  const openBookingModal = (staffId?: string, time?: string) => {
    setSelectedSlot(staffId && time ? { staffId, time } : null);
    setIsBookingOpen(true);
  };

  // Converts HH:MM + service duration into absolute pixel offsets (9 AM =   // Converts HH:MM + service duration into absolute pixel offsets (9 AM = 0).
  // Size tiers strictly per design system rules:
  //   SMALL  ≤ 30 min (px ≤ 48)  → name only (14px semibold)
  //   MEDIUM > 30 & < 60 min    → name + service
  //   LARGE  ≥ 60 min (px ≥ 96)  → name (top) + service (mid) + time (bot)
  const getAppointmentLayout = (app: Appointment): { style: React.CSSProperties; px: number } => {
    const service = services.find((s) => s.id === app.serviceId);
    const duration = service?.duration ?? 30;
    const [hours, minutes] = app.startTime.split(':').map(Number);
    const startMinutes = (hours - 9) * 60 + minutes;
    // 24px absolute minimum for visibility
    const px = Math.max(duration * PX_PER_MIN, 24);
    return {
      style: { top: `${startMinutes * PX_PER_MIN}px`, height: `${px}px` },
      px,
    };
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 md:p-6 border-b border-slate-200 bg-white flex-shrink-0">
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Appointments</h1>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={handlePrevDay}
              className="p-1.5 hover:bg-white rounded-md transition-all hover:shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-white rounded-md transition-all hover:shadow-sm"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleNextDay}
              className="p-1.5 hover:bg-white rounded-md transition-all hover:shadow-sm"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          <span className="text-base md:text-lg font-semibold text-slate-700">
            {currentDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <button
          type="button"
          onClick={() => openBookingModal()}
          className="hidden md:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Booking</span>
        </button>
      </div>

      {/* ── Desktop Calendar Grid ── */}
      <div className="hidden md:flex flex-1 overflow-auto bg-slate-50">
        {/* Time Labels */}
        <div className="w-14 md:w-20 flex-shrink-0 border-r border-slate-200 bg-white">
          <div className="h-14 border-b border-slate-200" />
          {HOURS.map((hour) => (
            <div key={hour} className="h-24 border-b border-slate-100 relative pr-4">
              <span className="absolute -top-2.5 right-3 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
              </span>
            </div>
          ))}
        </div>

        {/* Staff Columns */}
        <div className="flex-1 flex min-w-max">
          {staff.map((member) => {
            const memberAppointments = dayAppointments.filter(
              (a) => a.staffId === member.id,
            );

            return (
              <div
                key={member.id}
                className="flex-1 min-w-[180px] md:min-w-[260px] border-r border-slate-200 bg-white/50"
              >
                {/* Sticky Staff Header */}
                <div className="h-14 border-b border-slate-200 flex flex-col items-center justify-center sticky top-0 bg-white/80 backdrop-blur-sm z-10">
                  <span className="font-semibold text-sm text-slate-900">{member.name}</span>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">{member.role}</span>
                </div>

                {/* Scrollable Time Grid */}
                <div className="relative">
                  {HOURS.map((hour) => (
                    <div key={hour} className="h-24 border-b border-slate-100 relative">
                      <div
                        role="button"
                        onClick={() => openBookingModal(member.id, `${hour.toString().padStart(2, '0')}:00`)}
                        className="absolute top-0 left-0 w-full h-1/2 hover:bg-indigo-50/50 cursor-pointer border-b border-slate-50 transition-colors z-0"
                      />
                      <div
                        role="button"
                        onClick={() => openBookingModal(member.id, `${hour.toString().padStart(2, '0')}:30`)}
                        className="absolute bottom-0 left-0 w-full h-1/2 hover:bg-indigo-50/50 cursor-pointer transition-colors z-0"
                      />
                    </div>
                  ))}

                  {/* Appointment Cards */}
                  {memberAppointments.map((app) => {
                    const customer = customers.find((c) => c.id === app.customerId);
                    const service = services.find((s) => s.id === app.serviceId);
                    const { style, px } = getAppointmentLayout(app);

                    // Rules: SMALL (≤30m/48px), MEDIUM, LARGE (≥60m/96px)
                    const isSmall  = px <= 48;
                    const isLarge  = px >= 96;
                    const isMedium = !isSmall && !isLarge;

                    return (
                      <div
                        key={app.id}
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailAppointment(app);
                        }}
                        className={cn(
                          'absolute left-1.5 right-1.5 rounded-lg shadow-sm border overflow-hidden cursor-pointer hover:opacity-95 transition-all z-20',
                          (isMedium || isLarge) && 'flex flex-col',
                          isLarge && 'justify-between h-full',
                          isSmall ? 'p-1.5' : isMedium ? 'p-2 gap-1' : 'p-3',
                          app.status === 'cancelled'
                            ? 'bg-slate-100 border-slate-200 text-slate-400'
                            : app.status === 'completed'
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                            : member.color,
                        )}
                        style={style}
                      >
                        {/* Name (14px semibold) */}
                        <div className={isLarge ? 'flex-shrink-0' : ''}>
                          <p className="text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis leading-none">
                            {customer?.name ?? '—'}
                          </p>
                        </div>

                        {/* Service (12px medium) */}
                        {(isMedium || isLarge) && (
                          <div className={cn(isLarge ? 'flex-grow flex items-center' : '')}>
                            <p className="text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis leading-none opacity-90">
                              {service?.name ?? ''}
                            </p>
                          </div>
                        )}

                        {/* Time (11px muted) */}
                        {isLarge && (
                          <div className="flex-shrink-0">
                            <p className="text-[11px] font-medium whitespace-nowrap overflow-hidden text-ellipsis leading-none opacity-60 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {app.startTime}
                              {service ? ` (${service.duration}m)` : ''}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* ── Mobile List View ── */}
      <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col md:hidden p-4 space-y-6 pb-28">
        {Object.entries(groupedAppointments).length > 0 ? (
          Object.entries(groupedAppointments).map(([time, apps]) => (
            <div key={time} className="space-y-3">
              <h3 className="text-sm font-bold text-slate-500 sticky top-0 bg-slate-50 py-1 z-10">
                {time}
              </h3>
              <div className="space-y-2">
                {apps.map((app) => {
                  const customer = customers.find((c) => c.id === app.customerId);
                  const service = services.find((s) => s.id === app.serviceId);
                  const staffMember = staff.find((s) => s.id === app.staffId);
                  
                  return (
                    <div
                      key={app.id}
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailAppointment(app);
                      }}
                      className={cn(
                        "flex flex-col p-3 rounded-xl border shadow-sm cursor-pointer transition-transform active:scale-[0.98]",
                        app.status === 'cancelled'
                          ? 'bg-slate-100 border-slate-200 text-slate-400'
                          : app.status === 'completed'
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          : staffMember?.color || 'bg-white border-slate-200'
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-sm leading-tight">{customer?.name ?? '—'}</span>
                        <span className="text-[11px] font-bold opacity-80 px-2 py-0.5 rounded-md bg-white/40">{service?.duration}m</span>
                      </div>
                      <div className="flex justify-between items-end text-xs font-medium opacity-90 mt-1">
                        <span className="truncate pr-2">{service?.name ?? '—'}</span>
                        <span className="flex items-center gap-1.5 flex-shrink-0">
                          <div className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[8px] font-bold">
                            {staffMember?.name?.charAt(0)}
                          </div>
                          {staffMember?.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3 pt-10">
            <Clock className="w-10 h-10 opacity-20" />
            <p className="text-sm font-medium">No appointments today.</p>
          </div>
        )}
      </div>

      {/* ── Mobile Bottom CTA ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] z-30">
        <button
          type="button"
          onClick={() => openBookingModal()}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3.5 rounded-xl hover:bg-indigo-700 transition-colors font-bold shadow-sm text-base active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          New Booking
        </button>
      </div>
      
      {/* ── Modals ── */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialData={selectedSlot}
        currentDate={formattedDate}
      />
      <AppointmentDetailModal
        appointment={detailAppointment}
        onClose={() => setDetailAppointment(null)}
      />
    </div>
  );
}
