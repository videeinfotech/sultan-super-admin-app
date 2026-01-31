
import React, { useEffect, useState } from 'react';
import { superAdminApi } from '../../api.ts';

interface Props {
  productId: string | null;
  onBack: () => void;
}

const SuperAdminProductDetail: React.FC<Props> = ({ productId, onBack }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await superAdminApi.getProduct(productId);
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch product details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark">
        <header className="sticky top-0 z-50 bg-white dark:bg-background-dark border-b dark:border-gray-800 p-4">
          <button onClick={onBack} className="flex items-center gap-2">
            <span className="material-symbols-outlined">arrow_back_ios</span>
            <span className="font-bold text-lg">Product Details</span>
          </button>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Robust mapping to handle both nested and flat structures if needed, although backend is now flat
  const productData = data || {};
  const product = productData.product || productData;
  const inventory = productData.store_inventory || productData.inventory || [];

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto pb-20">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-[#dbdfe6] dark:border-gray-800">
        <div className="flex items-center p-4 justify-between">
          <div className="size-10 flex items-center justify-center cursor-pointer" onClick={onBack}>
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </div>
          <h2 className="text-lg font-bold flex-1 text-center truncate">{product.name}</h2>
          <div className="w-10 flex justify-end">
            <span className="material-symbols-outlined">ios_share</span>
          </div>
        </div>
      </header>

      <main className="animate-in fade-in duration-500">
        <div className="p-4">
          <img
            src={product.image || product.imageUrl || 'https://picsum.photos/seed/shoes1/400/400'}
            className="w-full aspect-square rounded-2xl shadow-sm object-cover bg-white"
            alt={product.name}
          />
        </div>

        <section className="px-4 py-2">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">{product.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-tight">SKU: {product.sku || 'N/A'}</p>
            <span className="material-symbols-outlined text-sm text-gray-400 cursor-pointer">content_copy</span>
          </div>
          <div className="flex gap-3 mt-4">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full tracking-widest">{product.category || 'Category'}</span>
            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full tracking-widest ${product.stock > 10 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {product.stock > 10 ? 'In Stock' : 'Low Stock'}
            </span>
          </div>
        </section>

        <section className="flex gap-4 p-4">
          <div className="flex-1 p-5 border border-[#dbdfe6] dark:border-gray-800 bg-white dark:bg-gray-800 rounded-2xl shadow-sm space-y-1">
            <div className="flex items-center gap-2 text-gray-400">
              <span className="material-symbols-outlined text-primary text-[20px]">inventory</span>
              <span className="text-[10px] font-black uppercase tracking-tighter">Total Stock</span>
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{product.stock || 0}</p>
          </div>
          <div className="flex-1 p-5 border border-[#dbdfe6] dark:border-gray-800 bg-white dark:bg-gray-800 rounded-2xl shadow-sm space-y-1">
            <div className="flex items-center gap-2 text-gray-400">
              <span className="material-symbols-outlined text-primary text-[20px]">storefront</span>
              <span className="text-[10px] font-black uppercase tracking-tighter">Locations</span>
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{inventory.length}</p>
          </div>
        </section>

        <section className="mt-4 px-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Store Distribution</h3>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Live Inventory</span>
          </div>
          <div className="rounded-2xl border border-[#dbdfe6] dark:border-gray-800 bg-white dark:bg-gray-800 divide-y dark:divide-gray-700 shadow-sm overflow-hidden">
            {inventory.length === 0 ? (
              <div className="p-8 text-center text-gray-400 italic font-medium">No distribution data available</div>
            ) : (
              inventory.map((item: any, i: number) => (
                <div key={i} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{item.store_name}</p>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">{item.location || 'Local Storage'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-base text-gray-900 dark:text-white">{item.quantity} Units</p>
                    <p className={`text-[10px] font-black uppercase ${item.quantity > 10 ? 'text-green-500' : 'text-red-500'}`}>
                      {item.quantity > 10 ? 'Healthy' : 'Critical'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-8 px-4 pb-12">
          <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">Description</h3>
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-[#dbdfe6] dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed shadow-sm html-content"
            dangerouslySetInnerHTML={{ __html: product.description || 'No description available for this product.' }}
          />
        </section>
      </main>

      <footer className="fixed bottom-0 w-full max-w-[430px] mx-auto bg-white/95 dark:bg-background-dark/95 backdrop-blur-md p-4 border-t dark:border-gray-800 flex justify-center items-center gap-2">
        <span className="material-symbols-outlined text-sm text-gray-400">lock</span>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secured Global Administrative View</span>
      </footer>
    </div>
  );
};

export default SuperAdminProductDetail;
