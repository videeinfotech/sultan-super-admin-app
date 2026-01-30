
import React from 'react';
import { SuperAdminView } from '../../types.ts';

interface Props {
  onNavigate: (view: SuperAdminView, id?: string) => void;
}

const staffMembers = [
  { name: 'Sarah Jenkins', role: 'Store Manager', status: 'On Shift', img: 'https://i.pravatar.cc/150?u=sarah' },
  { name: 'David Miller', role: 'Floor Supervisor', status: 'On Break', img: 'https://i.pravatar.cc/150?u=david' },
  { name: 'Jessica Lee', role: 'Sales Associate', status: 'On Shift', img: 'https://i.pravatar.cc/150?u=jessica' },
  { name: 'Michael Brown', role: 'Sales Associate', status: 'Clocked Out', img: 'https://i.pravatar.cc/150?u=michael' },
  { name: 'Emily Davis', role: 'Inventory Clerk', status: 'On Shift', img: 'https://i.pravatar.cc/150?u=emily' },
];

const StoreAdminStaff: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto pb-20">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md p-4 border-b dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined cursor-pointer" onClick={() => onNavigate('store-insight')}>arrow_back</span>
            <h2 className="text-xl font-bold">Store Staff</h2>
          </div>
          <span className="material-symbols-outlined text-primary">person_add</span>
        </div>
        <div className="mt-4 bg-primary/5 dark:bg-primary/10 p-3 rounded-2xl border border-primary/10">
          <p className="text-xs font-bold text-primary uppercase tracking-widest">Active Shift</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm font-bold text-gray-900 dark:text-white">3 Active • 1 Break • 1 Off</p>
            <span className="text-[10px] font-bold text-gray-500">OCT 24, 2023</span>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {staffMembers.map((staff, i) => (
          <div key={i} className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border dark:border-gray-800">
            <img src={staff.img} className="size-14 rounded-full border-2 border-primary/20 object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold truncate">{staff.name}</p>
              <p className="text-xs text-[#616f89] font-medium">{staff.role}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`size-2 rounded-full ${
                  staff.status === 'On Shift' ? 'bg-green-500' :
                  staff.status === 'On Break' ? 'bg-amber-400' : 'bg-gray-400'
                }`}></span>
                <span className="text-[10px] font-black uppercase tracking-tight text-[#616f89]">{staff.status}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="size-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">chat_bubble</span>
              </button>
              <button className="size-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">call</span>
              </button>
            </div>
          </div>
        ))}
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
        <div className="flex flex-col items-center text-primary cursor-pointer" onClick={() => onNavigate('store-staff')}>
          <span className="material-symbols-outlined fill-1">group</span>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Staff</span>
        </div>
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('store-settings')}>
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Settings</span>
        </div>
      </nav>
    </div>
  );
};

export default StoreAdminStaff;
