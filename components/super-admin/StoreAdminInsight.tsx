
import React, { useEffect, useState } from 'react';
import { SuperAdminView } from '../../types.ts';
import { superAdminApi } from '../../api.ts';

interface Props {
  onNavigate: (view: SuperAdminView, id?: string) => void;
  onBack: () => void;
  storeId: string | null;
}

const StoreAdminInsight: React.FC<Props> = ({ onNavigate, onBack, storeId }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeId) return;

    const fetchStoreInsight = async () => {
      setLoading(true);
      try {
        const res = await superAdminApi.getStore(storeId);
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch store insight', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreInsight();
  }, [storeId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-white dark:bg-background-dark">
        <header className="sticky top-0 z-50 flex items-center bg-white dark:bg-background-dark border-b dark:border-gray-800 p-4">
          <button onClick={onBack} className="flex size-10 items-center justify-center">
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </button>
          <h2 className="text-lg font-bold flex-1 text-center">Store Insight</h2>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const store = data || {};
  const stats = store.stats || {};

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto pb-24">
      <header className="sticky top-0 z-50 flex items-center bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 pb-2 justify-between border-b dark:border-gray-800">
        <div className="text-primary flex size-10 items-center justify-center cursor-pointer" onClick={onBack}>
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </div>
        <h2 className="text-lg font-bold flex-1 text-center truncate pr-10">{store.name}</h2>
      </header>

      <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex p-4 gap-4 items-center bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
          <div className="relative shrink-0">
            <img
              src={store.logo || 'https://picsum.photos/seed/store_insight/200/200'}
              className="size-20 rounded-2xl border dark:border-gray-700 object-cover bg-gray-50"
            />
            <span className={`absolute -bottom-1 -right-1 size-5 ${store.status === 'Open' ? 'bg-green-500' : 'bg-red-500'} border-2 border-white dark:border-gray-800 rounded-full shadow-sm`}></span>
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-xl font-black text-gray-900 dark:text-white truncate">{store.name}</p>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Branch ID: #{store.id}</p>
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-400 font-medium truncate">Owner: <span className="font-bold text-primary">{store.owner_name || 'Sarah Jenkins'}</span></p>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="flex justify-between bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-3xl p-2 shadow-sm">
            <div className="flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer transition-transform active:scale-90" onClick={() => onNavigate('store-stock')}>
              <div className="bg-primary/10 text-primary p-2.5 rounded-2xl">
                <span className="material-symbols-outlined text-[24px]">inventory</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-gray-500">Stock</p>
            </div>
            <div className="flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer transition-transform active:scale-90" onClick={() => onNavigate('store-staff')}>
              <div className="bg-primary/10 text-primary p-2.5 rounded-2xl">
                <span className="material-symbols-outlined text-[24px]">group</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-gray-500">Staff</p>
            </div>
            <div className="flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer transition-transform active:scale-90" onClick={() => onNavigate('store-settings')}>
              <div className="bg-primary/10 text-primary p-2.5 rounded-2xl">
                <span className="material-symbols-outlined text-[24px]">settings</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-gray-500">Setup</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Store Performance</h3>
          <span className="text-primary text-[10px] font-black flex items-center gap-1.5 uppercase">Live Status <span className="size-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span></span>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4">
          <div className="p-5 border dark:border-gray-800 rounded-3xl space-y-2 bg-white dark:bg-gray-800 shadow-sm transition-transform hover:translate-y-[-2px]">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Revenue Today</p>
            <p className="text-2xl font-black text-primary">${(stats.revenue || 0).toLocaleString()}</p>
            <p className="text-[#07883b] text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span> 12%
            </p>
          </div>
          <div className="p-5 border dark:border-gray-800 rounded-3xl space-y-2 bg-white dark:bg-gray-800 shadow-sm transition-transform hover:translate-y-[-2px]">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Orders Today</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{(stats.total_orders || 0).toLocaleString()}</p>
            <p className="text-primary text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">history</span> Just now
            </p>
          </div>
        </div>

        <div className="px-4 pt-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Inventory Management</h3>
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-2xl font-black text-gray-900 dark:text-white">{stats.total_products || 0}</span>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registered SKUs</p>
              </div>
              <button
                className="text-[10px] font-black text-white px-4 py-2 bg-primary rounded-xl shadow-lg shadow-primary/20 uppercase tracking-wider"
                onClick={() => onNavigate('store-stock')}
              >
                Stock List
              </button>
            </div>
            <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full flex overflow-hidden shadow-inner">
              <div className="bg-primary h-full w-[85%] shadow-sm"></div>
              <div className="bg-orange-400 h-full w-[10%] shadow-sm"></div>
              <div className="bg-red-500 h-full w-[5%] shadow-sm"></div>
            </div>
            <div className="flex gap-4 mt-6 text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-1.5 text-gray-400"><span className="size-2 rounded-full bg-primary"></span> Optimal</span>
              <span className="flex items-center gap-1.5 text-gray-400"><span className="size-2 rounded-full bg-orange-400"></span> Low</span>
              <span className="flex items-center gap-1.5 text-gray-400"><span className="size-2 rounded-full bg-red-500"></span> Critical</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 pb-12">
          <div className="flex justify-between items-center mb-4 ml-2">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Recent Activity</h3>
            <span className="text-primary text-[10px] font-black uppercase tracking-widest cursor-pointer hover:underline" onClick={() => onNavigate('orders')}>View All</span>
          </div>
          <div className="space-y-3">
            {store.recent_orders && store.recent_orders.length > 0 ? (
              store.recent_orders.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-3xl bg-white dark:bg-gray-800/40 shadow-sm active:scale-[0.98] transition-all cursor-pointer" onClick={() => onNavigate('order-detail', item.id)}>
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
                      <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 dark:text-white">#{item.order_number}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">{item.created_at} • {item.items_count} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900 dark:text-white">${item.total_amount.toLocaleString()}</p>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${item.status === 'Completed' ? 'bg-green-100 text-green-600' :
                        item.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                      }`}>{item.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 bg-gray-50 dark:bg-gray-900/40 rounded-3xl border border-dashed dark:border-gray-800">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No recent orders</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto h-20 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t dark:border-gray-800 flex items-center justify-around z-50">
        <div className="flex flex-col items-center text-primary cursor-pointer">
          <span className="material-symbols-outlined fill-1">dashboard</span>
          <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Overview</span>
        </div>
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('store-stock')}>
          <span className="material-symbols-outlined">inventory</span>
          <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Stock</span>
        </div>
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('store-staff')}>
          <span className="material-symbols-outlined">group</span>
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

export default StoreAdminInsight;
