'use client';

import { useStore, type Staff } from '@/store/useStore';
import { Plus, X, Edit2, Trash2, Award, Home } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';

const staffSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().optional(),
  color: z.string().min(1, 'Color selection is required'),
  commissionRate: z.number().min(0).max(100),
  boothRent: z.number().min(0),
});

type StaffFormValues = z.infer<typeof staffSchema>;

const STAFF_COLORS = [
  { name: 'Pink', value: 'bg-pink-100 border-pink-200 text-pink-700' },
  { name: 'Blue', value: 'bg-blue-100 border-blue-200 text-blue-700' },
  { name: 'Purple', value: 'bg-purple-100 border-purple-200 text-purple-700' },
  { name: 'Green', value: 'bg-green-100 border-green-200 text-green-700' },
  { name: 'Amber', value: 'bg-amber-100 border-amber-200 text-amber-700' },
  { name: 'Indigo', value: 'bg-indigo-100 border-indigo-200 text-indigo-700' },
  { name: 'Rose', value: 'bg-rose-100 border-rose-200 text-rose-700' },
  { name: 'Cyan', value: 'bg-cyan-100 border-cyan-200 text-cyan-700' },
];

export default function StaffPage() {
  const { staff, addStaff, updateStaff, deleteStaff } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      commissionRate: 70,
      boothRent: 250,
    },
  });

  const selectedColor = watch('color');

  const openModal = (member?: Staff) => {
    if (member) {
      setEditingStaff(member);
      reset({
        name: member.name,
        role: member.role,
        color: member.color,
        commissionRate: member.commissionRate ?? 70,
        boothRent: member.boothRent ?? 250,
      });
    } else {
      setEditingStaff(null);
      reset({
        name: '',
        role: '',
        color: STAFF_COLORS[0].value,
        commissionRate: 70,
        boothRent: 250,
      });
    }
    setIsModalOpen(true);
  };

  const onSubmit = (data: StaffFormValues) => {
    if (editingStaff) {
      updateStaff(editingStaff.id, data as any);
    } else {
      addStaff({
        id: `s-${Date.now()}`,
        name: data.name,
        role: data.role || '',
        color: data.color,
        commissionRate: data.commissionRate,
        boothRent: data.boothRent,
        rating: 4.9,
        workingDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'],
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Staff & Freelancer Management</h1>
          <p className="text-slate-500 mt-1">Manage team members, commission splits, and chair rental rates.</p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Staff / Freelancer
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-3 md:px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Staff Name</th>
                <th className="py-3 px-3 md:px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="py-3 px-3 md:px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Commission Split</th>
                <th className="py-3 px-3 md:px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Daily Booth Rent</th>
                <th className="py-3 px-3 md:px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Calendar Style</th>
                <th className="py-3 px-3 md:px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-3 md:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {member.name.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 md:px-6 text-sm text-slate-600">{member.role || '—'}</td>
                  <td className="py-4 px-3 md:px-6 text-sm font-bold text-indigo-600">
                    <span className="bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 inline-flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-indigo-500" />
                      {member.commissionRate}%
                    </span>
                  </td>
                  <td className="py-4 px-3 md:px-6 text-sm font-semibold text-slate-700">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                      <Home className="w-3.5 h-3.5 text-slate-400" />
                      ₹{member.boothRent}/day
                    </span>
                  </td>
                  <td className="py-4 px-3 md:px-6">
                    <div className={cn("px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border w-fit", member.color)}>
                      Sample Booking
                    </div>
                  </td>
                  <td className="py-4 px-3 md:px-6 text-right space-x-2">
                    <button
                      onClick={() => openModal(member)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      title="Edit Staff"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteStaff(member.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Delete Staff"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-white rounded-t-xl sm:rounded-lg shadow-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Role / Designation
                </label>
                <input
                  type="text"
                  {...register('role')}
                  placeholder="e.g. Senior Stylist"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    {...register('commissionRate', { valueAsNumber: true })}
                    placeholder="70"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Daily Rent (₹)
                  </label>
                  <input
                    type="number"
                    {...register('boothRent', { valueAsNumber: true })}
                    placeholder="250"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Calendar Label Color <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {STAFF_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setValue('color', color.value)}
                      className={cn(
                        "h-10 rounded-md border transition-all flex items-center justify-center",
                        color.value,
                        selectedColor === color.value ? "ring-2 ring-indigo-500 ring-offset-1 border-transparent scale-105" : "border-slate-100 opacity-60 hover:opacity-100"
                      )}
                      title={color.name}
                    >
                      <span className="text-[10px] font-bold uppercase truncate px-1">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  {editingStaff ? 'Save Changes' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

