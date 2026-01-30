
import React from 'react';
import { SuperAdminView } from '../../types';

interface Props {
  onNavigate: (view: SuperAdminView, id?: string) => void;
}

const stores = [
  { id: '1', name: 'Downtown Flagship', location: 'New York, NY', status: 'Open', rating: 4.8, growth: 12, img: 'https://picsum.photos/seed/store1/200/200' },
  { id: '2', name: 'Sunset Mall Branch', location: 'Los Angeles, CA', status: 'Open', rating: 4.5, growth: 5, img: 'https://picsum.photos/seed/store2/200/200' },
  { id: '3', name: 'Lakeside Plaza', location: 'Chicago, IL', status: 'Maintenance', rating: 4.2, growth: -2, img: 'https://picsum.photos/seed/store3/200/200' },
];

const SuperAdminStoreDirectory: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-background-dark overflow-y-auto pb-20">
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b dark:border-gray-800">
        <div className="flex items-center p-4 pb-2 justify-between">
          <span className="material-symbols-outlined text-2xl cursor-pointer" onClick={() => onNavigate('dashboard')}>arrow_back</span>
          <h2 className="text-lg font-bold flex-1 text-center">Store Directory</h2>
          <span className="material-symbols-outlined text-2xl">notifications</span>
        </div>
        <div className="flex gap-2 p-4 overflow-x-auto no-scrollbar">
          <button className="flex h-9 shrink-0 items-center bg-primary text-white px-4 rounded-full text-sm font-semibold">All Stores</button>
          <button className="flex h-9 shrink-0 items-center bg-[#f0f2f4] dark:bg-gray-800 px-4 rounded-full text-sm">Open</button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">84 Stores Active Today</h3>
          <span className="text-xs text-gray-500">Updated 2m ago</span>
        </div>

        {stores.map(store => (
          <div 
            key={store.id} 
            onClick={() => onNavigate('store-insight', store.id)}
            className="flex gap-4 p-4 border dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] bg-white dark:bg-gray-900"
          >
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex gap-2 mb-1">
                  <span className="text-[#f59e0b] text-xs font-bold bg-[#fff7ed] dark:bg-orange-900/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    {store.rating} <span className="material-symbols-outlined text-[12px] fill-current">star</span>
                  </span>
                  <span className={`${store.growth > 0 ? 'text-[#10b981] bg-[#ecfdf5] dark:bg-green-900/20' : 'text-red-500 bg-red-50 dark:bg-red-900/20'} text-xs font-bold px-1.5 py-0.5 rounded`}>
                    {store.growth > 0 ? '+' : ''}{store.growth}% Growth
                  </span>
                </div>
                <p className="text-base font-bold">{store.name}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`size-2 rounded-full ${store.status === 'Open' ? 'bg-green-500' : 'bg-orange-400'}`}></span>
                  <p className="text-[#616f89] text-sm">{store.location} • {store.status}</p>
                </div>
              </div>
              <div className="flex items-center bg-primary/10 text-primary mt-3 gap-1 px-4 py-2 rounded-lg text-sm font-bold w-fit">
                <span>View Details</span>
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </div>
            </div>
            <img src={store.img} className="size-24 rounded-xl object-cover border dark:border-gray-800" />
          </div>
        ))}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-40 bg-white dark:bg-gray-900 border-t border-[#dbdfe6] dark:border-gray-800 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-20 pb-2">
          <div className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Overview</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-primary cursor-pointer" onClick={() => onNavigate('store-directory')}>
            <span className="material-symbols-outlined">storefront</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Stores</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer" onClick={() => onNavigate('orders')}>
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Orders</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer" onClick={() => onNavigate('profile')}>
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default SuperAdminStoreDirectory;
