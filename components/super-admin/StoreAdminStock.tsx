
import React, { useEffect, useState } from 'react';
import { SuperAdminView } from '../../types.ts';
import { superAdminApi } from '../../api.ts';
import { useToast } from '../Toast.tsx';

interface Props {
  onNavigate: (view: SuperAdminView, id?: string) => void;
  storeId: string | null;
}

const StoreAdminStock: React.FC<Props> = ({ onNavigate, storeId }) => {
  const { showToast } = useToast();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [qty, setQty] = useState<number>(0);
  const [fieldErrors, setFieldErrors] = useState<any>({});

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setBy] = useState<'name' | 'price' | 'qty'>('name');

  const [showAddModal, setShowAddModal] = useState(false);
  const [globalProducts, setGlobalProducts] = useState<any[]>([]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedGlobalProduct, setSelectedGlobalProduct] = useState<any>(null);
  const [addQty, setAddQty] = useState<number>(0);

  const fetchStock = async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const res = await superAdminApi.getStore(storeId);
      if (res.success && res.data.inventory) {
        setInventory(res.data.inventory);
      }
    } catch (err) {
      console.error('Failed to fetch store inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [storeId]);

  const filteredInventory = inventory
    .filter(item => {
      const name = item.name || '';
      const sku = item.sku || '';
      return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sku.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'price') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'qty') return (b.qty || 0) - (a.qty || 0);
      return 0;
    });

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId || !selectedProduct) return;
    setFieldErrors({});
    try {
      await superAdminApi.updateStoreStock(storeId, selectedProduct.id, qty);
      setShowModal(false);
      fetchStock();
    } catch (err: any) {
      if (err.errors) {
        setFieldErrors(err.errors);
      } else {
        showToast(err.message || 'Failed to update stock', 'error');
      }
    }
  };

  const openUpdate = (item: any) => {
    setSelectedProduct(item);
    setQty(item.qty);
    setFieldErrors({});
    setShowModal(true);
  };

  const fetchGlobalProducts = async () => {
    setGlobalLoading(true);
    try {
      const query = globalSearch ? `?search=${globalSearch}` : '';
      const res = await superAdminApi.getProducts(query);
      if (res.success) {
        setGlobalProducts(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch global products', err);
    } finally {
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    if (showAddModal) {
      const debounce = setTimeout(fetchGlobalProducts, globalSearch ? 300 : 0);
      return () => clearTimeout(debounce);
    }
  }, [showAddModal, globalSearch]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId || !selectedGlobalProduct) return;
    try {
      await superAdminApi.updateStoreStock(storeId, selectedGlobalProduct.id, addQty);
      setShowAddModal(false);
      setSelectedGlobalProduct(null);
      setAddQty(0);
      fetchStock();
      showToast('Product added to store', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to add product', 'error');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto pb-20">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md p-4 border-b dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined cursor-pointer text-gray-600" onClick={() => onNavigate('store-insight', storeId || undefined)}>arrow_back</span>
            <h2 className="text-xl font-bold">Local Inventory</h2>
          </div>
          <span className="material-symbols-outlined text-primary cursor-pointer active:scale-90 transition-transform" onClick={() => setShowAddModal(true)}>add_circle</span>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="flex-1 flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700">
            <span className="material-symbols-outlined text-gray-400 text-lg">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none p-1"
              placeholder="Search product or SKU..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className={`p-2 rounded-xl transition-colors ${sortBy !== 'name' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
            onClick={() => {
              const types: any[] = ['name', 'price', 'qty'];
              const next = types[(types.indexOf(sortBy) + 1) % types.length];
              setBy(next);
            }}
          >
            <span className="material-symbols-outlined">{sortBy === 'name' ? 'filter_list' : sortBy === 'price' ? 'payments' : 'inventory_2'}</span>
          </button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
          <span>Product Details</span>
          <span>In Stock</span>
        </div>
        <div className="space-y-2">
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {filteredInventory.length === 0 ? (
                <div className="text-center p-12 text-gray-400 italic">No inventory records found for this search.</div>
              ) : (
                filteredInventory.map((item) => (
                  <div key={item.id} onClick={() => openUpdate(item)} className="p-4 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between group active:scale-95 transition-transform cursor-pointer">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="size-14 bg-gray-50 dark:bg-gray-900 rounded-2xl shrink-0 overflow-hidden border border-gray-100 dark:border-gray-800">
                        <img src={item.image || 'https://via.placeholder.com/200'} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-sm text-gray-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">SKU: {item.sku}</p>
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase mt-1 inline-block ${item.status === 'In Stock' ? 'bg-green-100 text-green-600' :
                          item.status === 'Low Stock' ? 'bg-orange-100 text-orange-500' : 'bg-red-100 text-red-500'
                          }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-xl font-black ${item.qty === 0 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{item.qty}</p>
                      <p className="text-[10px] font-black text-primary tracking-tighter">${item.price}</p>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black mb-1">Update Stock</h3>
            <p className="text-xs text-gray-500 mb-6">{selectedProduct?.name}</p>
            <form onSubmit={handleUpdateStock} className="space-y-4" noValidate>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Current Quantity</label>
                <input type="number" className={`w-full mt-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none text-center text-2xl font-black focus:ring-2 focus:ring-primary/20 ${fieldErrors.quantity ? 'ring-2 ring-red-500' : ''}`} value={qty} onChange={e => setQty(parseInt(e.target.value) || 0)} />
                {fieldErrors.quantity && <p className="text-[10px] text-red-500 font-bold mt-1 text-center">{fieldErrors.quantity[0]}</p>}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 dark:bg-gray-800 py-4 rounded-2xl font-black">Cancel</button>
                <button type="submit" className="flex-1 bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black">Assign Product</h3>
              <span className="material-symbols-outlined cursor-pointer text-gray-400" onClick={() => setShowAddModal(false)}>close</span>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 flex items-center px-3 py-2 rounded-xl mb-4">
              <span className="material-symbols-outlined text-gray-400 text-lg mr-2">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
                placeholder="Search global catalog..."
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 mb-4 min-h-[200px] pr-1">
              {globalLoading ? (
                <div className="flex justify-center p-8"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div></div>
              ) : (
                globalProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedGlobalProduct(p)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${selectedGlobalProduct?.id === p.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'}`}
                  >
                    <img src={p.imageUrl} className="size-10 rounded-lg object-cover bg-gray-50" />
                    <div className="min-w-0">
                      <p className="text-xs font-black truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{p.sku}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedGlobalProduct && (
              <div className="border-t dark:border-gray-800 pt-4 animate-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={selectedGlobalProduct.imageUrl} className="size-10 rounded-lg object-cover" />
                    <div>
                      <p className="text-[10px] font-black text-primary uppercase">Adding Product</p>
                      <p className="text-sm font-bold truncate max-w-[150px]">{selectedGlobalProduct.name}</p>
                    </div>
                  </div>
                  <div className="w-24">
                    <p className="text-[10px] font-black text-gray-400 uppercase text-center mb-1">Initial Stock</p>
                    <input
                      type="number"
                      className="w-full p-2 bg-gray-50 dark:bg-gray-800 rounded-xl border-none text-center font-black text-lg focus:ring-2 focus:ring-primary/20"
                      value={addQty}
                      onChange={e => setAddQty(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddProduct}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                >
                  Assign to Store
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto h-20 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t dark:border-gray-800 flex items-center justify-around z-50">
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('store-insight', storeId || undefined)}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Overview</span>
        </div>
        <div className="flex flex-col items-center text-primary cursor-pointer">
          <span className="material-symbols-outlined fill-1">inventory</span>
          <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Stock</span>
        </div>
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('store-staff')}>
          <span className="material-symbols-outlined">group</span>
          <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Staff</span>
        </div>
        <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => onNavigate('store-settings')}>
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Settings</span>
        </div>
      </nav>
    </div>
  );
};

export default StoreAdminStock;
