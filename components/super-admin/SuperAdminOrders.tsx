
import React from 'react';
import { SuperAdminView, Order } from '../../types.ts';

interface Props {
  onNavigate: (view: SuperAdminView, id?: string) => void;
}

const mockOrders: Order[] = [
  { id: 'ORD-9421', customer: 'Sarah Jenkins', store: 'Central Mall - Flagship', amount: 492, status: 'Completed', timestamp: '2 mins ago' },
  { id: 'ORD-9420', customer: 'Michael Ross', store: 'Downtown Boutique', amount: 1205.50, status: 'Pending', timestamp: '15 mins ago' },
  { id: 'ORD-9419', customer: 'David Chen', store: 'Airport Terminal 3', amount: 89, status: 'In Transit', timestamp: '1 hour ago' },
  { id: 'ORD-9418', customer: 'Emma Watson', store: 'Westside Outlet', amount: 215.75, status: 'Refunded', timestamp: '2 hours ago' },
];

const SuperAdminOrders: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto pb-20">
      <header className="sticky top-0 z-50 bg-white dark:bg-background-dark border-b border-[#dbdfe6] dark:border-gray-800">
        <div className="flex items-center p-4 pb-2 justify-between">
          <div className="text-primary flex size-10 items-center justify-center rounded-lg bg-primary/10 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <span className="material-symbols-outlined">public</span>
          </div>
          <h2 className="text-lg font-bold flex-1 ml-3">Global Orders</h2>
          <span className="material-symbols-outlined text-gray-400">notifications</span>
        </div>
      </header>

      <main className="flex flex-col p-4 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 p-4 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl shadow-sm">
            <p className="text-xs font-semibold text-[#616f89] uppercase">Total Orders</p>
            <p className="text-2xl font-bold">1,284</p>
            <p className="text-xs text-emerald-600 font-bold mt-1">+12.5%</p>
          </div>
          <div className="flex-1 p-4 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl shadow-sm">
            <p className="text-xs font-semibold text-[#616f89] uppercase">Total Revenue</p>
            <p className="text-2xl font-bold">$42,500</p>
            <p className="text-xs text-emerald-600 font-bold mt-1">+8.2%</p>
          </div>
        </div>

        <div className="flex items-center justify-between pb-2 pt-4">
          <h3 className="text-lg font-bold">Recent Orders</h3>
          <span className="text-xs font-semibold text-primary uppercase">Live Updates</span>
        </div>

        <div className="space-y-3">
          {mockOrders.map(order => (
            <div 
              key={order.id}
              onClick={() => onNavigate('order-detail', order.id)}
              className="p-4 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-[#616f89] uppercase">#{order.id}</p>
                  <p className="text-xs text-[#616f89]">{order.timestamp}</p>
                </div>
                <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${
                  order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                  order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                  order.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-sm font-bold">{order.store}</p>
                <p className="text-sm text-[#616f89]">Customer: {order.customer}</p>
              </div>
              <div className="flex justify-between items-center pt-2 mt-2 border-t dark:border-gray-800">
                <p className="text-lg font-extrabold text-primary">${order.amount.toFixed(2)}</p>
                <div className="flex items-center text-[#616f89]">
                  <span className="text-xs font-medium mr-1">View Details</span>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </div>
              </div>
            </div>
          ))}
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
          <div className="flex flex-col items-center gap-1 text-primary cursor-pointer" onClick={() => onNavigate('orders')}>
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

export default SuperAdminOrders;
