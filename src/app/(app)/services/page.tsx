'use client';

import { useStore, type Service } from '@/store/useStore';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const serviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 minute'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function ServicesPage() {
  const { services, addService, updateService, deleteService } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
  });

  const openModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      reset({
        name: service.name,
        duration: service.duration,
        price: service.price,
      });
    } else {
      setEditingService(null);
      reset({ name: '', duration: 30, price: 0 });
    }
    setIsModalOpen(true);
  };

  const onSubmit = (data: ServiceFormValues) => {
    if (editingService) {
      updateService(editingService.id, data);
    } else {
      addService({
        id: `srv-${Date.now()}`,
        ...data,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Services</h1>
          <p className="text-slate-500 mt-1">Configure your salon&apos;s service menu.</p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-3 md:px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Service Name</th>
                <th className="py-3 px-3 md:px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="py-3 px-3 md:px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="py-3 px-3 md:px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-3 md:px-6 text-sm font-semibold text-slate-900">{service.name}</td>
                  <td className="py-4 px-3 md:px-6 text-sm text-slate-600">{service.duration} mins</td>
                  <td className="py-4 px-3 md:px-6 text-sm font-bold text-slate-900">₹{service.price.toLocaleString()}</td>
                  <td className="py-4 px-3 md:px-6 text-right space-x-2">
                    <button
                      onClick={() => openModal(service)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      title="Edit Service"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteService(service.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 text-sm">
                    No services found. Add your first service!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Service Modal */}
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
                {editingService ? 'Edit Service' : 'Add New Service'}
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
                  Service Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. Haircut"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                {errors.name && (
                  <p className="mt-1 text-[10px] font-medium text-rose-500 uppercase tracking-tight">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Duration (mins) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register('duration')}
                    placeholder="30"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  {errors.duration && (
                    <p className="mt-1 text-[10px] font-medium text-rose-500 uppercase tracking-tight">
                      {errors.duration.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register('price')}
                    placeholder="500"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  {errors.price && (
                    <p className="mt-1 text-[10px] font-medium text-rose-500 uppercase tracking-tight">
                      {errors.price.message}
                    </p>
                  )}
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
                  {editingService ? 'Save Changes' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
