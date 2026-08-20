import { create } from 'zustand';

export type Staff = {
  id: string;
  name: string;
  role: string;
  color: string;
};

export type Service = {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastVisit: string;
};

export type Appointment = {
  id: string;
  customerId: string;
  staffId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  status: 'scheduled' | 'completed' | 'cancelled';
};

export type State = {
  staff: Staff[];
  services: Service[];
  customers: Customer[];
  appointments: Appointment[];
  // Returns true if added successfully, false if there is a scheduling conflict
  addAppointment: (app: Appointment) => boolean;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  addCustomer: (customer: Customer) => void;
  // Admin actions
  addService: (service: Service) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addStaff: (member: Staff) => void;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
};

/** Convert HH:MM string to total minutes from midnight */
function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** Returns true if two time windows overlap */
function hasConflict(
  startA: string,
  durA: number,
  startB: string,
  durB: number,
): boolean {
  const a1 = toMinutes(startA);
  const a2 = a1 + durA;
  const b1 = toMinutes(startB);
  const b2 = b1 + durB;
  return a1 < b2 && b1 < a2;
}

// Use local date to avoid UTC shifting the day backward for IST (+05:30) users
const todayLocal = new Date().toLocaleDateString('en-CA'); // gives YYYY-MM-DD in local tz

export const useStore = create<State>((set, get) => ({
  staff: [
    { id: 's1', name: 'Aisha', role: 'Senior Stylist', color: 'bg-pink-100 border-pink-200 text-pink-700' },
    { id: 's2', name: 'Rahul', role: 'Barber', color: 'bg-blue-100 border-blue-200 text-blue-700' },
    { id: 's3', name: 'Priya', role: 'Colorist', color: 'bg-purple-100 border-purple-200 text-purple-700' },
    { id: 's4', name: 'Vikram', role: 'Massage Therapist', color: 'bg-green-100 border-green-200 text-green-700' },
  ],
  services: [
    { id: 'srv1', name: 'Haircut', duration: 30, price: 500 },
    { id: 'srv2', name: 'Hair Color', duration: 120, price: 2500 },
    { id: 'srv3', name: 'Beard Trim', duration: 15, price: 200 },
    { id: 'srv4', name: 'Facial', duration: 60, price: 1200 },
    { id: 'srv5', name: 'Massage', duration: 60, price: 1500 },
  ],
  customers: [
    { id: 'c1', name: 'Amit Kumar', phone: '9876543210', email: 'amit@example.com', lastVisit: '2026-04-15' },
    { id: 'c2', name: 'Neha Sharma', phone: '9876543211', email: 'neha@example.com', lastVisit: '2026-05-01' },
    { id: 'c3', name: 'Rohan Gupta', phone: '9876543212', email: 'rohan@example.com', lastVisit: '2026-03-20' },
    { id: 'c4', name: 'Sneha Patel', phone: '9876543213', email: 'sneha@example.com', lastVisit: '2026-04-28' },
  ],
  appointments: [
    { id: 'a1', customerId: 'c1', staffId: 's1', serviceId: 'srv1', date: todayLocal, startTime: '10:00', status: 'scheduled' },
    { id: 'a2', customerId: 'c2', staffId: 's3', serviceId: 'srv2', date: todayLocal, startTime: '11:00', status: 'scheduled' },
    { id: 'a3', customerId: 'c3', staffId: 's2', serviceId: 'srv3', date: todayLocal, startTime: '14:30', status: 'scheduled' },
    { id: 'a4', customerId: 'c4', staffId: 's4', serviceId: 'srv5', date: todayLocal, startTime: '16:00', status: 'scheduled' },
  ],

  addAppointment: (app) => {
    const { appointments, services } = get();
    const newService = services.find((s) => s.id === app.serviceId);
    const newDuration = newService?.duration ?? 30;

    // Reject if staff already has an overlapping appointment on same date
    const conflict = appointments.some((existing) => {
      if (existing.staffId !== app.staffId) return false;
      if (existing.date !== app.date) return false;
      if (existing.status === 'cancelled') return false;
      const existingService = services.find((s) => s.id === existing.serviceId);
      const existingDuration = existingService?.duration ?? 30;
      return hasConflict(app.startTime, newDuration, existing.startTime, existingDuration);
    });

    if (conflict) return false;

    set((state) => ({ appointments: [...state.appointments, app] }));
    return true;
  },

  updateAppointment: (id, updates) =>
    set((state) => ({
      appointments: state.appointments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),

  addCustomer: (customer) =>
    set((state) => ({
      customers: [...state.customers, customer],
    })),

  addService: (service) =>
    set((state) => ({
      services: [...state.services, service],
    })),

  updateService: (id, updates) =>
    set((state) => ({
      services: state.services.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),

  deleteService: (id) =>
    set((state) => ({
      services: state.services.filter((s) => s.id !== id),
    })),

  addStaff: (member) =>
    set((state) => ({
      staff: [...state.staff, member],
    })),

  updateStaff: (id, updates) =>
    set((state) => ({
      staff: state.staff.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),

  deleteStaff: (id) =>
    set((state) => ({
      staff: state.staff.filter((s) => s.id !== id),
    })),
}));
