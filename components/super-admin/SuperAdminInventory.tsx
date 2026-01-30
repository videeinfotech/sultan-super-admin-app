
import React from 'react';
import { SuperAdminView, Product } from '../../types';

interface Props {
  onNavigate: (view: SuperAdminView, id?: string) => void;
}

const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    sku: 'APPL-15P-BLK',
    category: 'Electronics',
    stock: 452,
    status: 'In Stock',
    imageUrl: 'https://picsum.photos/seed/iphone/200/200'
  },
  {
    id: '2',
    name: 'Sony XM5 Headphones',
    sku: 'SNY-XM5-WHT',
    category: 'Audio',
    stock: 12,
    status: 'Low Stock',
    imageUrl: 'https://picsum.photos/seed/sony/200/200'
  },
  {
    id: '3',
    name: 'Keychron K2 V2',
    sku: 'KEY-K2V2-RGB',
    category: 'Accessories',
    stock: 0,
    status: 'Out of Stock',
    imageUrl: 'https://picsum.photos/seed/keyboard/200/200'
  },
  {
    id: '4',
    name: 'Apple Watch Ultra',
    sku: 'APPL-WULT-ORG',
    category: 'Wearables',
    stock: 86,
    status: 'In Stock',
    imageUrl: 'https://picsum.photos/seed/watch/200/200'
  }
];

const SuperAdminInventory: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto">
      <header className="sticky top-0 z-20 bg-white dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center p-4 pb-2 justify-between">
          <div 
            className="text-primary flex size-10 shrink-0 items-center justify-center bg-primary/10 rounded-full cursor-pointer"
            onClick={() => onNavigate('dashboard')}
          >
            <span className="material-symbols-outlined">dashboard</span>
          </div>
          <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight flex-1 ml-3">Inventory Global View</h2>
          <div className="text-gray-400">
            <span className="material-symbols-outlined">notifications</span>
          </div>
        </div>
        <div className="px-4 py-3">
          <div className="flex w-full items-stretch rounded-xl h-11 bg-white dark:bg-gray-800 shadow-sm">
            <div className="text-gray-400 flex items-center justify-center pl-4">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input className="form-input flex w-full border-none focus:ring-0 bg-transparent text-sm" placeholder="Search SKU or product name..." />
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 px-4 overflow-y-auto">
        <div className="flex items-center justify-between pt-6 pb-2">
          <h3 className="text-gray-900 dark:text-white text-lg font-extrabold">Active Inventory ({products.length})</h3>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Read Only</span>
        </div>

        <div className="space-y-3 mt-2">
          {products.map(product => (
            <div 
              key={product.id}
              onClick={() => onNavigate('product-detail', product.id)}
              className={`flex gap-4 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-50 dark:border-gray-700 items-center transition-transform active:scale-[0.98] cursor-pointer ${product.status === 'Out of Stock' ? 'opacity-70' : ''}`}
            >
              <img src={product.imageUrl} className="size-20 rounded-lg object-cover" alt={product.name} />
              <div className="flex-1 min-w-0">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                  product.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                  product.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {product.status}
                </span>
                <p className="text-gray-900 dark:text-white text-base font-bold truncate mt-1">{product.name}</p>
                <p className="text-gray-400 text-xs font-medium mt-1">SKU: {product.sku} • {product.category}</p>
                <p className={`${product.status === 'In Stock' ? 'text-primary' : 'text-amber-600'} text-sm font-bold mt-1`}>
                  {product.stock} units {product.status === 'In Stock' ? 'across all stores' : 'remaining'}
                </p>
              </div>
              <span className="material-symbols-outlined text-gray-300">chevron_right</span>
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

export default SuperAdminInventory;
