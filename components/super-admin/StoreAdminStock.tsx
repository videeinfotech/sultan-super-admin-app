
import React from 'react';
import { SuperAdminView } from '../../types.ts';

interface Props {
  onNavigate: (view: SuperAdminView, id?: string) => void;
}

const localStock = [
  { id: '1', name: 'Nike Air Max 270', sku: 'NK-AM270-BLK', qty: 12, status: 'In Stock', price: 150 },
  { id: '2', name: 'Adidas Ultraboost', sku: 'AD-UB22-WHT', qty: 3, status: 'Low Stock', price: 180 },
  { id: '3', name: 'Yeezy Boost 350', sku: 'YZY-350-BRED', qty: 0, status: 'Out of Stock', price: 220 },
  { id: '4', name: 'Puma RS-X', sku: 'PM-RSX-GRY', qty: 24, status: 'In Stock', price: 110 },
  { id: '5', name: 'New Balance 550', sku: 'NB-550-GRN', qty: 8, status: 'In Stock', price: 120 },
];

const StoreAdminStock: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto pb-20">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md p-4 border-b dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined cursor-pointer" onClick={() => onNavigate('store-insight')}>arrow_back</span>
            <h2 className="text-xl font-bold">Local Inventory</h2>
          </div>
          <span className="material-symbols-outlined text-primary">add_circle</span>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="flex-1 flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl">
            <span className="material-symbols-outlined text-gray-400 text-lg">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-full" placeholder="Search product or SKU..." />
          </div>
          <button className="bg-gray-100 dark:bg-gray-800 p-2 rounded-xl text-gray-500">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-[#616f89] uppercase tracking-widest px-1">
          <span>Product Details</span>
          <span>Qty</span>
        </div>
        <div className="space-y-3">
          {localStock.map((item) => (
            <div key={item.id} className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                  <span className="material-symbols-outlined">image</span>
                </div>
                <div>
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-[10px] text-[#616f89] mt-0.5">SKU: {item.sku}</p>
                  <span className={`text-[9px] font-black uppercase mt-1 inline-block ${
                    item.status === 'In Stock' ? 'text-green-600' :
                    item.status === 'Low Stock' ? 'text-orange-500' : 'text-red-500'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-extrabold ${item.qty === 0 ? 'text-red-500' : ''}`}>{item.qty}</p>
                <p className="text-[10px] font-bold text-[#616f89] tracking-tighter">${item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto h-20 bg-white dark:bg-background-dark border-t dark:border-gray-800 flex items-center justify-around z-50">
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('store-insight')}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Overview</span>
        </div>
        <div className="flex flex-col items-center text-primary cursor-pointer" onClick={() => onNavigate('store-stock')}>
          <span className="material-symbols-outlined fill-1">inventory</span>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Stock</span>
        </div>
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('store-staff')}>
          <span className="material-symbols-outlined">group</span>
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

export default StoreAdminStock;
