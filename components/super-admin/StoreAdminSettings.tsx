
import React from 'react';
import { SuperAdminView } from '../../types.ts';

interface Props {
  onNavigate: (view: SuperAdminView, id?: string) => void;
  onLogout: () => void;
}

const StoreAdminSettings: React.FC<Props> = ({ onNavigate, onLogout }) => {
  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto pb-20">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md p-4 border-b dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined cursor-pointer" onClick={() => onNavigate('store-insight')}>arrow_back</span>
          <h2 className="text-xl font-bold">Store Configuration</h2>
        </div>
      </header>

      <main className="p-4 space-y-6">
        <section>
          <p className="text-[10px] font-black uppercase text-[#616f89] tracking-widest px-1 mb-2">Operational Hours</p>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 overflow-hidden divide-y dark:divide-gray-800">
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm font-medium">Monday - Friday</span>
              <span className="text-sm font-bold text-primary">09:00 - 22:00</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm font-medium">Saturday</span>
              <span className="text-sm font-bold text-primary">10:00 - 23:00</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm font-medium">Sunday</span>
              <span className="text-sm font-bold text-primary">Closed</span>
            </div>
          </div>
        </section>

        <section>
          <p className="text-[10px] font-black uppercase text-[#616f89] tracking-widest px-1 mb-2">Inventory Alerts</p>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 overflow-hidden">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-orange-600">
                  <span className="material-symbols-outlined text-lg">warning</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Low Stock Warning</p>
                  <p className="text-[10px] text-gray-500">Alert at 10% threshold</p>
                </div>
              </div>
              <div className="w-11 h-6 bg-primary rounded-full relative">
                <div className="size-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <p className="text-[10px] font-black uppercase text-[#616f89] tracking-widest px-1 mb-2">Location & Contact</p>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 p-4 space-y-4">
            <div>
              <p className="text-[10px] text-[#616f89] uppercase font-bold">Address</p>
              <p className="text-sm mt-0.5">721 Broadway, New York, NY 10003</p>
            </div>
            <div>
              <p className="text-[10px] text-[#616f89] uppercase font-bold">Primary Phone</p>
              <p className="text-sm mt-0.5 text-primary font-bold">+1 (212) 555-0192</p>
            </div>
          </div>
        </section>

        <div className="pt-4">
          <button 
            onClick={onLogout}
            className="w-full bg-red-50 dark:bg-red-900/10 text-red-600 border border-red-100 dark:border-red-900/30 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined">logout</span>
            Exit Global Console
          </button>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto h-20 bg-white dark:bg-background-dark border-t dark:border-gray-800 flex items-center justify-around z-50">
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('store-insight')}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Overview</span>
        </div>
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('store-stock')}>
          <span className="material-symbols-outlined">inventory</span>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Stock</span>
        </div>
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('store-staff')}>
          <span className="material-symbols-outlined">group</span>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Staff</span>
        </div>
        <div className="flex flex-col items-center text-primary cursor-pointer" onClick={() => onNavigate('store-settings')}>
          <span className="material-symbols-outlined fill-1">settings</span>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Settings</span>
        </div>
      </nav>
    </div>
  );
};

export default StoreAdminSettings;
