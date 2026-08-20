import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'freelancer' | 'client';

export type Staff = {
  id: string;
  name: string;
  role: string;
  color: string;
  commissionRate: number; // percentage e.g. 70 = 70%
  boothRent: number; // daily booth rent in INR e.g. 200
  bio?: string;
  specialties?: string[];
  rating?: number;
  workingDays?: string[];
  phone?: string;
  email?: string;
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
  tips?: number;
  notes?: string;
};

export type State = {
  activeRole: UserRole;
  activeStaffId: string;
  staff: Staff[];
  services: Service[];
  customers: Customer[];
  appointments: Appointment[];
  
  // Role actions
  setActiveRole: (role: UserRole) => void;
  setActiveStaffId: (staffId: string) => void;

  // Appointment actions
  addAppointment: (app: Appointment) => boolean;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  addCustomer: (customer: Customer) => void;
  
  // Admin & Staff actions
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

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      activeRole: 'admin',
      activeStaffId: 's1',
      staff: [
        {
          id: 's1',
          name: 'Aisha Khan',
          role: 'Master Stylist & Freelancer',
          color: 'bg-pink-100 border-pink-200 text-pink-700',
          commissionRate: 70,
          boothRent: 300,
          bio: '10+ years experience in bridal hair styling and luxury cut transformations.',
          specialties: ['Balayage', 'Haircut', 'Keratin'],
          rating: 4.9,
          workingDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'],
          phone: '9876500001',
          email: 'aisha@zenyme.com',
        },
        {
          id: 's2',
          name: 'Rahul Verma',
          role: 'Freelance Barber Specialist',
          color: 'bg-blue-100 border-blue-200 text-blue-700',
          commissionRate: 75,
          boothRent: 250,
          bio: 'Precision beard sculpting and modern fade cuts for gentlemen.',
          specialties: ['Fade Cuts', 'Beard Trim', 'Head Massage'],
          rating: 4.8,
          workingDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          phone: '9876500002',
          email: 'rahul@zenyme.com',
        },
        {
          id: 's3',
          name: 'Priya Sharma',
          role: 'Creative Colorist',
          color: 'bg-purple-100 border-purple-200 text-purple-700',
          commissionRate: 65,
          boothRent: 200,
          bio: 'Specialist in organic hair coloring and ombre highlights.',
          specialties: ['Hair Color', 'Highlights', 'Facial'],
          rating: 4.95,
          workingDays: ['Tue', 'Wed', 'Thu', 'Sat', 'Sun'],
          phone: '9876500003',
          email: 'priya@zenyme.com',
        },
        {
          id: 's4',
          name: 'Vikram Singh',
          role: 'Spa & Wellness Therapist',
          color: 'bg-green-100 border-green-200 text-green-700',
          commissionRate: 80,
          boothRent: 400,
          bio: 'Certified Swedish and deep tissue therapy practitioner.',
          specialties: ['Massage', 'Facial'],
          rating: 4.85,
          workingDays: ['Mon', 'Thu', 'Fri', 'Sat', 'Sun'],
          phone: '9876500004',
          email: 'vikram@zenyme.com',
        },
      ],
      services: [
        { id: 'srv1', name: 'Signature Haircut & Style', duration: 45, price: 600 },
        { id: 'srv2', name: 'Balayage & Color Correction', duration: 120, price: 3200 },
        { id: 'srv3', name: 'Beard Sculpt & Razor Finish', duration: 30, price: 350 },
        { id: 'srv4', name: 'Gold Glow Facial Therapy', duration: 60, price: 1500 },
        { id: 'srv5', name: 'Aromatherapy Full Body Massage', duration: 60, price: 1800 },
      ],
      customers: [
        { id: 'c1', name: 'Amit Kumar', phone: '9876543210', email: 'amit@example.com', lastVisit: '2026-04-15' },
        { id: 'c2', name: 'Neha Sharma', phone: '9876543211', email: 'neha@example.com', lastVisit: '2026-05-01' },
        { id: 'c3', name: 'Rohan Gupta', phone: '9876543212', email: 'rohan@example.com', lastVisit: '2026-03-20' },
        { id: 'c4', name: 'Sneha Patel', phone: '9876543213', email: 'sneha@example.com', lastVisit: '2026-04-28' },
      ],
      appointments: [
        { id: 'a1', customerId: 'c1', staffId: 's1', serviceId: 'srv1', date: todayLocal, startTime: '10:00', status: 'completed', tips: 100, notes: 'Client requested extra layers' },
        { id: 'a2', customerId: 'c2', staffId: 's3', serviceId: 'srv2', date: todayLocal, startTime: '11:30', status: 'scheduled', tips: 200 },
        { id: 'a3', customerId: 'c3', staffId: 's2', serviceId: 'srv3', date: todayLocal, startTime: '14:30', status: 'completed', tips: 50 },
        { id: 'a4', customerId: 'c4', staffId: 's4', serviceId: 'srv5', date: todayLocal, startTime: '16:00', status: 'scheduled' },
      ],

      setActiveRole: (activeRole) => set({ activeRole }),
      setActiveStaffId: (activeStaffId) => set({ activeStaffId }),

      addAppointment: (app) => {
        const { appointments, services } = get();
        const newService = services.find((s) => s.id === app.serviceId);
        const newDuration = newService?.duration ?? 30;

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
    }),
    {
      name: 'zenyme-storage',
    }
  )
);

