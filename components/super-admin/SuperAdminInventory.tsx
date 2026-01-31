
import React, { useEffect, useState } from 'react';
import { SuperAdminView, Product } from '../../types.ts';
import { superAdminApi } from '../../api.ts';

interface Props {
  onNavigate: (view: SuperAdminView, id?: string) => void;
}

const SuperAdminInventory: React.FC<Props> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = search ? `?search=${search}` : '';
        const res = await superAdminApi.getProducts(query);
        if (res.success) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch global products', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProducts, search ? 300 : 0);
    return () => clearTimeout(debounce);
  }, [search]);

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
          <div className="flex w-full items-stretch rounded-xl h-11 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-gray-400 flex items-center justify-center pl-4">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="form-input flex w-full border-none focus:ring-0 bg-transparent text-sm"
              placeholder="Search SKU or product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 px-4 overflow-y-auto">
        <div className="flex items-center justify-between pt-6 pb-2">
          <h3 className="text-gray-900 dark:text-white text-lg font-extrabold">Active Inventory ({products.length})</h3>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Read Only</span>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            {products.length === 0 ? (
              <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">inventory_2</span>
                <p className="text-gray-400">No products found</p>
              </div>
            ) : (
              products.map(product => (
                <div
                  key={product.id}
                  onClick={() => onNavigate('product-detail', product.id)}
                  className={`flex gap-4 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-50 dark:border-gray-700 items-center transition-transform active:scale-[0.98] cursor-pointer ${product.status === 'Out of Stock' ? 'opacity-70' : ''}`}
                >
                  <img src={product.imageUrl} className="size-20 rounded-lg object-cover bg-gray-50" alt={product.name} />
                  <div className="flex-1 min-w-0">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${product.status === 'In Stock' ? 'bg-green-100 text-green-700' :
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
              ))
            )}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-40 bg-white dark:bg-gray-900 border-t border-[#dbdfe6] dark:border-gray-800 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-20 pb-2">
          <div className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Overview</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-primary cursor-pointer" onClick={() => onNavigate('inventory')}>
            <span className="material-symbols-outlined">inventory</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Inventory</span>
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
