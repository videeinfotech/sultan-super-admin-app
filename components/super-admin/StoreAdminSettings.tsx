
import React, { useEffect, useState } from 'react';
import { SuperAdminView } from '../../types.ts';
import { superAdminApi } from '../../api.ts';
import { useToast } from '../Toast.tsx';

interface Props {
  onNavigate: (view: SuperAdminView, id?: string) => void;
  onLogout: () => void;
  storeId: string | null;
}

const StoreAdminSettings: React.FC<Props> = ({ onNavigate, onLogout, storeId }) => {
  const { showToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', location: '', website: '', owner_name: '' });
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [permissions, setPermissions] = useState({
    can_manage_inventory: true,
    can_process_orders: true,
    can_manage_staff: false,
    can_view_analytics: true
  });

  const fetchSettings = async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const res = await superAdminApi.getStore(storeId);
      if (res.success) {
        setData(res.data);
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          location: res.data.location || '',
          website: res.data.website || '',
          owner_name: res.data.owner_name || ''
        });
        if (res.data.permissions) {
          setPermissions(res.data.permissions);
        }
      }
    } catch (err) {
      console.error('Failed to fetch store settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [storeId]);

  const handleUpdateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;
    setFieldErrors({});
    try {
      await superAdminApi.updateStore(storeId, formData);
      setShowEditModal(false);
      fetchSettings();
      showToast('success', 'Identity Updated: Store configuration has been successfully saved.');
    } catch (err: any) {
      if (err.errors) {
        setFieldErrors(err.errors);
      } else {
        showToast('failed', err.message || 'Configuration Error: Unable to synchronize store updates.');
      }
    }
  };

  const handleUpdatePermissions = async () => {
    if (!storeId) return;
    try {
      await superAdminApi.updateStore(storeId, { permissions });
      setShowPermissionsModal(false);
      showToast('success', 'Permissions Synchronized: Governance settings have been updated.');
      fetchSettings();
    } catch (err: any) {
      showToast('failed', err.message || 'Governance Error: Unable to modify administrative permissions.');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto pb-24">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md p-4 border-b dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined cursor-pointer text-gray-600" onClick={() => onNavigate('store-insight', storeId || undefined)}>arrow_back</span>
            <h2 className="text-xl font-bold">Store Configuration</h2>
          </div>
          <button onClick={() => { setShowEditModal(true); setFieldErrors({}); }} className="text-primary font-bold text-sm">Edit</button>
        </div>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <main className="p-4 space-y-6 animate-in fade-in duration-500">
          <section>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1 mb-3">Store Identity</p>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center gap-4">
              <img src={data?.logo || `https://picsum.photos/seed/store_${storeId}/200/200`} className="size-16 rounded-2xl object-cover bg-gray-50 shrink-0" alt="" />
              <div className="min-w-0">
                <p className="font-black text-lg text-gray-900 dark:text-white truncate">{data?.name}</p>
                <p className="text-[10px] text-primary font-black uppercase tracking-widest">ID: {data?.id} • Owner: {data?.owner_name}</p>
                {data?.parent_store && (
                  <p className="text-[10px] text-amber-600 font-bold uppercase tracking-tight mt-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md inline-block">
                    Parent Store: {data.parent_store.name}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1 mb-3">Location & Contact</p>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-5">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-400 mt-1">location_on</span>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Physical Address</p>
                  <p className="text-sm mt-1 font-bold text-gray-700 dark:text-gray-300">{data?.location || 'No address provided'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 border-t dark:border-gray-700 pt-5">
                <span className="material-symbols-outlined text-gray-400 mt-1">mail</span>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Business Email</p>
                  <p className="text-sm mt-1 font-bold text-gray-700 dark:text-gray-300 truncate">{data?.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 border-t dark:border-gray-700 pt-5">
                <span className="material-symbols-outlined text-gray-400 mt-1">globe</span>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Website</p>
                  <p className="text-sm mt-1 font-bold text-primary truncate underline decoration-primary/30">{data?.website || 'N/A'}</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1 mb-3">Global Controls</p>
            <div className="space-y-3">
              <button
                onClick={() => setShowPermissionsModal(true)}
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 py-4 rounded-3xl font-black flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px] text-primary">edit</span>
                Modify Permissions
              </button>
              <button
                onClick={onLogout}
                className="w-full bg-red-50 dark:bg-red-900/10 text-red-600 border border-red-100 dark:border-red-900/30 py-4 rounded-3xl font-black flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Exit Administrative Profile
              </button>
            </div>
          </section>
        </main>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Edit Store Setup</h3>
              <span className="material-symbols-outlined cursor-pointer text-gray-400" onClick={() => setShowEditModal(false)}>close</span>
            </div>
            <form onSubmit={handleUpdateStore} className="space-y-4" noValidate>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Store Name</label>
                <input className={`w-full mt-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-primary/20 ${fieldErrors.name ? 'ring-2 ring-red-500' : ''}`} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                {fieldErrors.name && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{fieldErrors.name[0]}</p>}
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Owner Name</label>
                <input className={`w-full mt-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-primary/20 ${fieldErrors.owner_name ? 'ring-2 ring-red-500' : ''}`} value={formData.owner_name} onChange={e => setFormData({ ...formData, owner_name: e.target.value })} />
                {fieldErrors.owner_name && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{fieldErrors.owner_name[0]}</p>}
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Business Email</label>
                <input type="email" className={`w-full mt-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-primary/20 ${fieldErrors.email ? 'ring-2 ring-red-500' : ''}`} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                {fieldErrors.email && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{fieldErrors.email[0]}</p>}
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Location</label>
                <textarea className={`w-full mt-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-primary/20 ${fieldErrors.location ? 'ring-2 ring-red-500' : ''}`} value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                {fieldErrors.location && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{fieldErrors.location[0]}</p>}
              </div>
              <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {showPermissionsModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Modify Permissions</h3>
              <span className="material-symbols-outlined cursor-pointer text-gray-400" onClick={() => setShowPermissionsModal(false)}>close</span>
            </div>
            <div className="space-y-4 mb-8">
              {Object.entries(permissions).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <span className="text-sm font-bold capitalize text-gray-700 dark:text-gray-300">{key.replace(/_/g, ' ')}</span>
                  <button
                    onClick={() => setPermissions({ ...permissions, [key]: !value })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                  >
                    <div className={`absolute top-1 left-1 size-4 bg-white rounded-full transition-transform ${value ? 'translate-x-6' : ''}`}></div>
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleUpdatePermissions}
              className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
            >
              Update Permissions
            </button>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto h-20 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t dark:border-gray-800 flex items-center justify-around z-50">
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('store-insight', storeId || undefined)}>
          <span className="material-symbols-outlined text-[24px]">dashboard</span>
          <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Overview</span>
        </div>
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('store-stock')}>
          <span className="material-symbols-outlined text-[24px]">inventory</span>
          <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Stock</span>
        </div>
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('store-staff')}>
          <span className="material-symbols-outlined text-[24px]">group</span>
          <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Staff</span>
        </div>
        <div className="flex flex-col items-center text-primary cursor-pointer">
          <span className="material-symbols-outlined fill-1 text-[24px]">settings</span>
          <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Settings</span>
        </div>
      </nav>
    </div>
  );
};

export default StoreAdminSettings;
