
import React from 'react';
import { StoreAdminView } from '../../types';
import { formatPrice } from '../../api.ts';

interface Props {
  onNavigate: (view: StoreAdminView) => void;
  onLogout: () => void;
}

const StoreAdminInsight: React.FC<Props> = ({ onNavigate, onLogout }) => {
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-background-dark overflow-y-auto pb-20">
      <header className="sticky top-0 z-50 flex items-center bg-white/90 dark:bg-background-dark/90 backdrop-blur-md p-4 pb-2 justify-between border-b dark:border-gray-800">
        <div className="text-primary flex size-10 items-center justify-center cursor-pointer" onClick={onLogout}>
          <span className="material-symbols-outlined">logout</span>
        </div>
        <h2 className="text-lg font-bold flex-1 text-center">Store Insight</h2>
        <span className="material-symbols-outlined text-primary">notifications</span>
      </header>

      <main>
        <div className="flex p-4 gap-4 items-center">
          <div className="relative">
            <img src="https://picsum.photos/seed/store_insight/200/200" className="size-20 rounded-2xl border dark:border-gray-800 object-cover" />
            <span className="absolute -bottom-1 -right-1 size-5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
          </div>
          <div className="flex flex-col">
            <p className="text-xl font-extrabold">Downtown Flagship</p>
            <p className="text-[#616f89] text-sm font-medium">Branch ID: #RE-04288</p>
            <p className="text-sm mt-0.5">Manager: <span className="font-semibold">Sarah Jenkins</span></p>
          </div>
        </div>

        <div className="px-4 py-2">
          <div className="flex justify-between bg-background-light dark:bg-gray-800/50 rounded-2xl p-2">
            <div className="flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer" onClick={() => onNavigate('stock')}>
              <div className="bg-white dark:bg-background-dark p-2.5 rounded-full shadow-sm text-primary">
                <span className="material-symbols-outlined text-[20px]">inventory</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider">Stock</p>
            </div>
            <div className="flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer" onClick={() => onNavigate('staff')}>
              <div className="bg-white dark:bg-background-dark p-2.5 rounded-full shadow-sm text-primary">
                <span className="material-symbols-outlined text-[20px]">group</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider">Staff</p>
            </div>
            <div className="flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer">
              <div className="bg-white dark:bg-background-dark p-2.5 rounded-full shadow-sm text-primary">
                <span className="material-symbols-outlined text-[20px]">receipt</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider">Sales</p>
            </div>
            <div className="flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer" onClick={() => onNavigate('settings')}>
              <div className="bg-white dark:bg-background-dark p-2.5 rounded-full shadow-sm text-primary">
                <span className="material-symbols-outlined text-[20px]">settings</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider">Setup</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pt-6 pb-2">
          <h3 className="text-lg font-extrabold">Performance Today</h3>
          <span className="text-primary text-xs font-bold flex items-center gap-1">LIVE UPDATES <span className="size-2 bg-red-500 rounded-full animate-pulse"></span></span>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4">
          <div className="p-4 border dark:border-gray-800 rounded-2xl space-y-1 bg-white dark:bg-gray-800/30">
            <p className="text-[#616f89] text-[10px] font-bold uppercase tracking-widest">Revenue</p>
            <p className="text-2xl font-extrabold">{formatPrice(12450)}</p>
            <p className="text-[#07883b] text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span> 12.4%
            </p>
          </div>
          <div className="p-4 border dark:border-gray-800 rounded-2xl space-y-1 bg-white dark:bg-gray-800/30">
            <p className="text-[#616f89] text-[10px] font-bold uppercase tracking-widest">Foot Traffic</p>
            <p className="text-2xl font-extrabold">1,240</p>
            <p className="text-[#07883b] text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span> 5.2%
            </p>
          </div>
        </div>

        <div className="px-4 pt-4">
          <h3 className="text-lg font-extrabold mb-3">Inventory Health</h3>
          <div className="bg-background-light dark:bg-gray-800/50 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold">Local SKUs: 1,429</span>
              <span className="text-xs font-bold text-primary px-3 py-1 bg-white dark:bg-background-dark rounded-lg cursor-pointer" onClick={() => onNavigate('stock')}>View Stock</span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full flex overflow-hidden">
              <div className="bg-primary h-full w-[75%]"></div>
              <div className="bg-orange-400 h-full w-[15%]"></div>
              <div className="bg-red-500 h-full w-[10%]"></div>
            </div>
            <div className="flex gap-4 mt-4 text-[11px] font-bold text-[#616f89]">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary"></span> Optimal (1,071)</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-orange-400"></span> Low (214)</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-red-500"></span> Out (144)</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 pb-12">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-extrabold">Recent Orders</h3>
            <span className="text-primary text-xs font-bold uppercase tracking-wider cursor-pointer">History</span>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 border dark:border-gray-800 rounded-xl bg-white dark:bg-gray-800/20">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">shopping_bag</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">#ORD-90{40 + item}</p>
                    <p className="text-[11px] text-[#616f89] font-medium">{item * 2} mins ago • {item} items</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold">{formatPrice(item * 52.5)}</p>
                  <span className="text-[9px] font-bold text-[#07883b] uppercase tracking-tighter">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto h-20 bg-white dark:bg-background-dark border-t dark:border-gray-800 flex items-center justify-around z-50">
        <div className="flex flex-col items-center text-primary cursor-pointer" onClick={() => onNavigate('insight')}>
          <span className="material-symbols-outlined fill-1">dashboard</span>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Overview</span>
        </div>
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('stock')}>
          <span className="material-symbols-outlined">inventory</span>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Stock</span>
        </div>
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('staff')}>
          <span className="material-symbols-outlined">group</span>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Staff</span>
        </div>
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('settings')}>
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Settings</span>
        </div>
      </nav>
    </div>
  );
};

export default StoreAdminInsight;
