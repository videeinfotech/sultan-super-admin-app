
import React, { useEffect, useState } from 'react';
import { superAdminApi } from '../../api.ts';

interface Props {
  orderId: string | null;
  onBack: () => void;
}

const SuperAdminOrderDetail: React.FC<Props> = ({ orderId, onBack }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await superAdminApi.getOrder(orderId);
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch order details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark">
        <header className="sticky top-0 z-10 flex items-center bg-white dark:bg-background-dark border-b dark:border-gray-800 p-4">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600">
            <span className="material-symbols-outlined">arrow_back_ios</span>
            <span className="font-bold text-lg">Order Details</span>
          </button>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const order = data || {};
  const customer = data?.customer || {};
  const items = data?.items || [];
  const store = data?.store || {};

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto">
      <header className="sticky top-0 z-10 flex items-center bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm border-b dark:border-gray-800 p-4 justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onBack}>
          <span className="material-symbols-outlined text-gray-600">arrow_back_ios</span>
          <h2 className="text-lg font-bold">Order #{order.id}</h2>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${order.status === 'Delivered' || order.status === 'Completed' ? 'bg-green-100 text-green-600' :
          order.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'
          }`}>
          {order.status}
        </div>
      </header>

      <main className="space-y-3 pb-24">
        <div className="bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white">Order Summary</h3>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            {order.created_at ? new Date(order.created_at).toLocaleString() : 'Date N/A'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 flex gap-4 items-center border-b dark:border-gray-700">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">storefront</span>
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold text-gray-900 dark:text-white truncate">{store.name || 'Store Not Found'}</p>
            <p className="text-sm text-gray-500 font-medium">Branch ID: {order.store_id} • {store.location || 'Location'}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Customer Details</h3>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <img src={customer.avatar || 'https://picsum.photos/seed/customer/200'} className="w-full h-full object-cover" alt="" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{customer.name || 'Anonymous'}</p>
              <p className="text-xs text-gray-500 font-medium">{customer.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Items ({items.length})</h3>
          <div className="divide-y dark:divide-gray-700">
            {items.map((item: any) => (
              <div key={item.id} className="py-3 flex gap-4 first:pt-0 last:pb-0">
                <img
                  src={item.product_image || 'https://picsum.photos/seed/item1/100/100'}
                  className="size-16 rounded-xl object-cover bg-gray-50"
                  alt=""
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.product_name}</p>
                  <p className="text-xs text-gray-500 font-medium">SKU: {item.sku || 'N/A'} • {item.variant || 'Standard'}</p>
                  <div className="flex justify-between items-end mt-1">
                    <span className="text-xs text-gray-400 font-bold uppercase">Qty: {item.qty}</span>
                    <span className="text-sm font-black text-primary">${item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 space-y-3 border-b dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white pb-2">Payment Summary</h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Subtotal</span>
            <span className="font-bold text-gray-900 dark:text-white">${order.amount || '0.00'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Shipping</span>
            <span className="font-bold text-gray-900 dark:text-white">${order.shipping || '0.00'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Discount</span>
            <span className="font-bold text-red-500">-${order.discount || '0.00'}</span>
          </div>
          <div className="flex justify-between text-lg font-black border-t dark:border-gray-700 pt-4 mt-2">
            <span className="text-gray-900 dark:text-white">Grand Total</span>
            <span className="text-primary">${order.total || '0.00'}</span>
          </div>
          <div className="mt-4 flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <span className="material-symbols-outlined text-gray-500 text-[20px]">credit_card</span>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-tighter">Paid via Store Payment Gateway</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminOrderDetail;
