
import React from 'react';
import { SuperAdminView } from '../../types.ts';

interface Props {
  onLogout: () => void;
  onBack: () => void;
  onNavigate: (view: SuperAdminView) => void;
}

const SuperAdminProfile: React.FC<Props> = ({ onLogout, onBack, onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto pb-20">
      <header className="sticky top-0 z-50 flex items-center bg-white dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b dark:border-gray-800">
        <div className="size-10 flex items-center justify-center cursor-pointer" onClick={onBack}>
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </div>
        <h2 className="text-lg font-bold flex-1 text-center">Profile & Settings</h2>
        <span className="text-primary font-bold cursor-pointer">Save</span>
      </header>

      <main className="pb-24">
        <div className="flex flex-col items-center p-6 gap-4">
          <div className="relative">
            <img src="https://picsum.photos/seed/admin_face/200/200" className="size-28 rounded-full ring-4 ring-white dark:ring-gray-800 shadow-sm" />
            <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg">
              <span className="material-symbols-outlined text-sm">photo_camera</span>
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-bold">Alex Johnson</p>
              <span className="bg-primary/10 text-primary text-[10px] uppercase font-black px-2 py-0.5 rounded-full">Super Admin</span>
            </div>
            <p className="text-[#616f89] text-sm">Member since March 2023</p>
            <p className="text-primary text-sm font-semibold mt-2">Change Profile Photo</p>
          </div>
        </div>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider px-4 pb-2 pt-4 text-[#616f89]">Personal Information</h3>
          <div className="bg-white dark:bg-gray-900 border-y dark:border-gray-800 divide-y dark:divide-gray-800">
            <div className="px-4 py-3">
              <p className="text-[#616f89] text-[10px] uppercase font-bold">Full Name</p>
              <p className="mt-0.5">Alex Johnson</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[#616f89] text-[10px] uppercase font-bold">Email Address</p>
              <p className="mt-0.5">alex.johnson@retailops.com</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider px-4 pb-2 pt-6 text-[#616f89]">Security</h3>
          <div className="bg-white dark:bg-gray-900 border-y dark:border-gray-800 divide-y dark:divide-gray-800">
            <div className="px-4 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#616f89]">lock</span>
                <span>Change Password</span>
              </div>
              <span className="material-symbols-outlined text-[#616f89]">chevron_right</span>
            </div>
            <div className="px-4 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#616f89]">verified_user</span>
                <span>Two-Factor Authentication</span>
              </div>
              <div className="w-11 h-6 bg-primary rounded-full relative">
                <div className="size-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 px-4 flex flex-col items-center gap-4">
          <button 
            onClick={onLogout}
            className="w-full bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/30 text-red-600 font-bold py-4 rounded-xl shadow-sm active:scale-[0.98] transition-all"
          >
            Logout
          </button>
          <p className="text-[#616f89] text-xs font-medium">Version 1.0.4 (Build 240)</p>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-40 bg-white dark:bg-gray-900 border-t border-[#dbdfe6] dark:border-gray-800 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-20 pb-2">
          <div className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Overview</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer" onClick={() => onNavigate('store-directory')}>
            <span className="material-symbols-outlined">storefront</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Stores</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer" onClick={() => onNavigate('orders')}>
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Orders</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-primary cursor-pointer" onClick={() => onNavigate('profile')}>
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default SuperAdminProfile;
