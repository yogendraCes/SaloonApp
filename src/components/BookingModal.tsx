'use client';

import { useStore, type Appointment } from '@/store/useStore';
import { useEffect, useState, useMemo } from 'react';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';

// ─── Booking (create) modal ───────────────────────────────────────────────────

const bookingSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  staffId: z.string().min(1, 'Staff member is required'),
  serviceId: z.string().min(1, 'Service is required'),
  startTime: z.string().min(1, 'Start time is required'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function BookingModal({
  isOpen,
  onClose,
  initialData,
  currentDate,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: { staffId: string; time: string } | null;
  currentDate: string;
}) {
  const { staff, customers, services, appointments, addAppointment } = useStore();
  const [conflictError, setConflictError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  const selectedStaffId = watch('staffId');
  const selectedTime = watch('startTime');

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 9; h <= 18; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`);
      slots.push(`${h.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }, []);

  const staffAppointments = useMemo(() => {
    if (!selectedStaffId) return [];
    return appointments.filter(
      (a) => a.staffId === selectedStaffId && a.date === currentDate && a.status !== 'cancelled'
    );
  }, [appointments, selectedStaffId, currentDate]);

  const availableSlots = useMemo(() => {
    return timeSlots.map((time) => {
      const [h, m] = time.split(':').map(Number);
      const slotMins = h * 60 + m;
      
      let isAvailable = true;
      for (const app of staffAppointments) {
        const [ah, am] = app.startTime.split(':').map(Number);
        const appStartMins = ah * 60 + am;
        const appService = services.find((s) => s.id === app.serviceId);
        const appDuration = appService?.duration || 30;
        const appEndMins = appStartMins + appDuration;
        
        if (slotMins >= appStartMins && slotMins < appEndMins) {
          isAvailable = false;
          break;
        }
      }
      return { time, isAvailable };
    });
  }, [timeSlots, staffAppointments, services]);

  useEffect(() => {
    if (selectedStaffId && isOpen) {
      const currentIsAvailable = availableSlots.find((s) => s.time === selectedTime)?.isAvailable;
      if (!currentIsAvailable) {
        const firstAvailable = availableSlots.find((s) => s.isAvailable);
        if (firstAvailable) {
          setValue('startTime', firstAvailable.time, { shouldValidate: true });
        } else {
          setValue('startTime', '', { shouldValidate: true });
        }
      }
    }
  }, [selectedStaffId, availableSlots, selectedTime, setValue, isOpen]);

  const formatTime = (time: string) => {
    if (!time) return '';
    const [h, m] = time.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  // Reset form whenever the modal opens and pre-fill slot if provided
  useEffect(() => {
    if (isOpen) {
      setConflictError(false);
      reset({
        staffId: initialData?.staffId ?? '',
        startTime: initialData?.time ?? '10:00',
        customerId: '',
        serviceId: '',
      });
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: BookingFormValues) => {
    setConflictError(false);
    const ok = addAppointment({
      id: `appt-${Date.now()}`,
      customerId: data.customerId,
      staffId: data.staffId,
      serviceId: data.serviceId,
      date: currentDate,
      startTime: data.startTime,
      status: 'scheduled',
    });

    if (!ok) {
      setConflictError(true);
      return;
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-t-xl sm:rounded-lg shadow-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-base font-bold text-slate-900">New Booking</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {conflictError && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 p-3 text-xs font-medium text-rose-700">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>Scheduling conflict:</strong> This staff member already has an appointment during that time.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Customer</label>
            <select
              {...register('customerId')}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
            >
              <option value="">Select a customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
            {errors.customerId && (
              <p className="mt-1 text-[10px] font-medium text-rose-500 uppercase tracking-tight">{errors.customerId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Service</label>
            <select
              {...register('serviceId')}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
            >
              <option value="">Select a service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.duration}m — ₹{s.price})
                </option>
              ))}
            </select>
            {errors.serviceId && (
              <p className="mt-1 text-[10px] font-medium text-rose-500 uppercase tracking-tight">{errors.serviceId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Staff Member</label>
            <select
              {...register('staffId')}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
            >
              <option value="">Select staff</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.staffId && (
              <p className="mt-1 text-[10px] font-medium text-rose-500 uppercase tracking-tight">{errors.staffId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Available Time</label>
            <input type="hidden" {...register('startTime')} />
            {!selectedStaffId ? (
              <div className="text-sm font-medium text-slate-500 bg-slate-50/50 p-6 rounded-xl text-center border border-slate-100 border-dashed">
                Please select a staff member first.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableSlots.map(({ time, isAvailable }) => (
                  <button
                    key={time}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => setValue('startTime', time, { shouldValidate: true })}
                    className={cn(
                      "px-2 py-2.5 text-xs font-bold rounded-lg border transition-all active:scale-[0.98]",
                      selectedTime === time
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-sm ring-2 ring-indigo-600 ring-offset-1"
                        : !isAvailable
                        ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed opacity-50"
                        : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50"
                    )}
                  >
                    {formatTime(time)}
                  </button>
                ))}
              </div>
            )}
            {errors.startTime && (
              <p className="mt-1 text-[10px] font-medium text-rose-500 uppercase tracking-tight">{errors.startTime.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Appointment detail modal ─────────────────────────────────────────────────

export function AppointmentDetailModal({
  appointment,
  onClose,
}: {
  appointment: Appointment | null;
  onClose: () => void;
}) {
  const { customers, services, staff, updateAppointment } = useStore();

  if (!appointment) return null;

  const customer = customers.find((c) => c.id === appointment.customerId);
  const service = services.find((s) => s.id === appointment.serviceId);
  const member = staff.find((s) => s.id === appointment.staffId);

  const markComplete = () => {
    updateAppointment(appointment.id, { status: 'completed' });
    onClose();
  };

  const markCancelled = () => {
    updateAppointment(appointment.id, { status: 'cancelled' });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-t-xl sm:rounded-lg shadow-xl w-full sm:max-w-sm max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-base font-bold text-slate-900">Appointment Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <Row label="Customer" value={customer?.name ?? '—'} isBold />
          <Row label="Phone" value={customer?.phone ?? '—'} />
          <Row label="Service" value={service ? `${service.name} (${service.duration}m)` : '—'} />
          <Row label="Price" value={service ? `₹${service.price}` : '—'} isBold />
          <Row label="Staff" value={member?.name ?? '—'} />
          <Row label="Date" value={appointment.date} />
          <Row label="Time" value={appointment.startTime} />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</span>
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                appointment.status === 'completed'
                  ? 'bg-emerald-50 text-emerald-700'
                  : appointment.status === 'cancelled'
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-amber-50 text-amber-700'
              )}
            >
              {appointment.status}
            </span>
          </div>
        </div>

        {appointment.status === 'scheduled' && (
          <div className="flex gap-3 p-4 border-t border-slate-100 mt-2 bg-slate-50/50">
            <button
              type="button"
              onClick={markCancelled}
              className="flex-1 px-4 py-2 text-sm font-semibold text-rose-700 bg-white border border-rose-100 rounded-lg hover:bg-rose-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={markComplete}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, isBold }: { label: string; value: string; isBold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className={cn("text-sm text-slate-900", isBold ? "font-bold" : "font-medium")}>{value}</span>
    </div>
  );
}
