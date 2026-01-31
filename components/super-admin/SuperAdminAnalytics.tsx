
import React, { useEffect, useState } from 'react';
import { SuperAdminView } from '../../types.ts';
import { superAdminApi, formatPrice } from '../../api.ts';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

interface Props {
  onNavigate: (view: SuperAdminView) => void;
}

const SuperAdminAnalytics: React.FC<Props> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await superAdminApi.getAnalytics();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch global analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const stats = data?.overview || {
    total_sales: 0,
    sales_change: 0,
    total_orders: 0,
    orders_change: 0
  };

  const trend = data?.revenue_trend || [];
  const topStores = data?.top_stores || [];

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto pb-24">
      <header className="sticky top-0 z-50 flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-4 justify-between border-b dark:border-gray-800">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">public</span>
          <h1 className="text-lg font-bold">Global Analytics</h1>
        </div>
        <span className="material-symbols-outlined text-gray-600">notifications</span>
      </header>

      <div className="flex gap-3 p-4 overflow-x-auto no-scrollbar sticky top-[68px] bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm z-40">
        <button className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-primary text-white px-4 shadow-sm">
          <span className="material-symbols-outlined text-[20px]">calendar_today</span>
          <p className="text-sm font-semibold">Last 7 Days</p>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <main className="px-4 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm">
              <p className="text-gray-500 text-xs font-semibold uppercase">Total Sales</p>
              <p className="text-xl font-bold">{formatPrice(stats.total_sales)}</p>
              <p className={`${stats.sales_change >= 0 ? 'text-[#07883b]' : 'text-red-500'} text-xs font-bold`}>
                {stats.sales_change >= 0 ? '+' : ''}{stats.sales_change}% vs LW
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm">
              <p className="text-gray-500 text-xs font-semibold uppercase">Total Orders</p>
              <p className="text-xl font-bold">{stats.total_orders.toLocaleString()}</p>
              <p className={`${stats.orders_change >= 0 ? 'text-[#07883b]' : 'text-red-500'} text-xs font-bold`}>
                {stats.orders_change >= 0 ? '+' : ''}{stats.orders_change}% vs LW
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm">
            <h2 className="font-bold mb-4">Revenue Trend</h2>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#135bec" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#135bec" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    hide
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="rev" stroke="#135bec" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3">Top Performing Stores</h2>
            <div className="space-y-3">
              {topStores.length === 0 ? (
                <div className="text-center p-8 text-gray-400 italic">No store data available</div>
              ) : (
                topStores.map((store: any) => (
                  <div key={store.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm transition-transform active:scale-[0.98]">
                    <div className="flex gap-3 items-center">
                      <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">storefront</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm truncate max-w-[150px]">{store.name}</h3>
                        <p className="text-xs text-gray-500">{store.orders.toLocaleString()} orders this week</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{formatPrice(store.revenue)}</p>
                      <p className={`text-xs ${store.growth >= 0 ? 'text-[#07883b]' : 'text-red-500'}`}>
                        {store.growth >= 0 ? '+' : ''}{store.growth}%
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      )}

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
          <div className="flex flex-col items-center gap-1 text-primary cursor-pointer" onClick={() => onNavigate('analytics')}>
            <span className="material-symbols-outlined">insights</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Analytics</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default SuperAdminAnalytics;
