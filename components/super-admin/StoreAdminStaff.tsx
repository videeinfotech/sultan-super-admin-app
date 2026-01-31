
import React, { useEffect, useState } from 'react';
import { SuperAdminView } from '../../types.ts';
import { superAdminApi } from '../../api.ts';
import { useToast } from '../Toast.tsx';

interface Props {
  onNavigate: (view: SuperAdminView, id?: string) => void;
  storeId: string | null;
}

const StoreAdminStaff: React.FC<Props> = ({ onNavigate, storeId }) => {
  const { showToast, confirm } = useToast();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'SUB ADMIN', password: '' });
  const [fieldErrors, setFieldErrors] = useState<any>({});

  const fetchStaff = async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const res = await superAdminApi.getStore(storeId);
      if (res.success && res.data.users) {
        setStaff(res.data.users);
      }
    } catch (err) {
      console.error('Failed to fetch store staff', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [storeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    try {
      if (editingStaff) {
        await superAdminApi.updateStaff(editingStaff.id, formData);
      } else {
        await superAdminApi.addStaff({ ...formData, store_id: storeId });
      }
      setShowModal(false);
      setEditingStaff(null);
      setFormData({ name: '', email: '', role: 'SUB ADMIN', password: '' });
      fetchStaff();
      showToast('success', editingStaff ? 'Team Synchronized: Staff member details updated.' : 'Access Granted: New staff member added to team.');
    } catch (err: any) {
      if (err.errors) {
        setFieldErrors(err.errors);
      } else {
        showToast('failed', err.message || 'Identity Error: Unable to finalize staff changes.');
      }
    }
  };

  const handleDelete = (id: string) => {
    confirm({
      message: 'Are you sure you want to remove this staff member? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await superAdminApi.removeStaff(id);
          fetchStaff();
          showToast('success', 'Registry Updated: Staff member has been removed.');
        } catch (err) {
          showToast('failed', 'Critical Error: Unable to remove staff member from the database.');
        }
      }
    });
  };

  const openEdit = (member: any) => {
    setEditingStaff(member);
    setFieldErrors({});
    setFormData({ name: member.name, email: member.email, role: member.role, password: '' });
    setShowModal(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto pb-20">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md p-4 border-b dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined cursor-pointer text-gray-600" onClick={() => onNavigate('store-insight', storeId || undefined)}>arrow_back</span>
            <h2 className="text-xl font-bold">Store Staff</h2>
          </div>
          <span className="material-symbols-outlined text-primary cursor-pointer" onClick={() => { setEditingStaff(null); setFormData({ name: '', email: '', role: 'SUB ADMIN', password: '' }); setFieldErrors({}); setShowModal(true); }}>person_add</span>
        </div>
        <div className="mt-4 bg-primary/5 dark:bg-primary/10 p-4 rounded-3xl border border-primary/10">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest">Team Composition</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm font-bold text-gray-900 dark:text-white">{staff.length} Total Members</p>
            <span className="text-[10px] font-black text-gray-400 uppercase">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {staff.length === 0 ? (
              <div className="text-center p-12 text-gray-400 italic">No staff members found for this store.</div>
            ) : (
              staff.map((member, i) => (
                <div key={member.id} className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform">
                  <img src={member.avatar || 'https://i.pravatar.cc/150?u=' + member.id} className="size-14 rounded-2xl border-2 border-primary/10 object-cover bg-gray-50" />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-black truncate text-gray-900 dark:text-white">{member.name}</p>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">{member.role}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className={`size-2 rounded-full ${member.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-[10px] font-black uppercase tracking-tight text-gray-500">{member.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(member)} className="size-10 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-primary shadow-sm hover:shadow-md transition-shadow">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button onClick={() => handleDelete(member.id)} className="size-10 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 shadow-sm hover:shadow-md transition-shadow">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">{editingStaff ? 'Edit Staff' : 'Add New Staff'}</h3>
              <span className="material-symbols-outlined cursor-pointer text-gray-400" onClick={() => setShowModal(false)}>close</span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Full Name</label>
                <input className={`w-full mt-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-primary/20 ${fieldErrors.name ? 'ring-2 ring-red-500' : ''}`} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                {fieldErrors.name && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{fieldErrors.name[0]}</p>}
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Email Address</label>
                <input type="email" className={`w-full mt-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-primary/20 ${fieldErrors.email ? 'ring-2 ring-red-500' : ''}`} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                {fieldErrors.email && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{fieldErrors.email[0]}</p>}
              </div>
              {!editingStaff && (
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Password</label>
                  <input type="password" placeholder="Min 6 chars" className={`w-full mt-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-primary/20 ${fieldErrors.password ? 'ring-2 ring-red-500' : ''}`} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                  {fieldErrors.password && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{fieldErrors.password[0]}</p>}
                </div>
              )}
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Role</label>
                <select className={`w-full mt-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-primary/20 ${fieldErrors.role ? 'ring-2 ring-red-500' : ''}`} value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                  <option value="SUB ADMIN">Sub Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="STAFF">Regular Staff</option>
                </select>
                {fieldErrors.role && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{fieldErrors.role[0]}</p>}
              </div>
              <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
                {editingStaff ? 'Update Member' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto h-20 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t dark:border-gray-800 flex items-center justify-around z-50">
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('store-insight', storeId || undefined)}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Overview</span>
        </div>
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('store-stock')}>
          <span className="material-symbols-outlined">inventory</span>
          <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Stock</span>
        </div>
        <div className="flex flex-col items-center text-primary cursor-pointer">
          <span className="material-symbols-outlined fill-1">group</span>
          <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Staff</span>
        </div>
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('store-settings')}>
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Settings</span>
        </div>
      </nav>
    </div>
  );
};

export default StoreAdminStaff;
