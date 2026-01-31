
import React, { useEffect, useState } from 'react';
import { SuperAdminView } from '../../types.ts';
import { superAdminApi } from '../../api.ts';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface Props {
  onNavigate: (view: SuperAdminView) => void;
}

const SuperAdminDashboard: React.FC<Props> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('today');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await superAdminApi.getDashboard(`?period=${period}`);
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  if (loading && !data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = data?.stats || {
    total_revenue: 0,
    revenue_change: 0,
    total_stores: 0,
    stores_change: 0,
    total_orders: 0,
    orders_change: 0,
  };

  const trend = data?.sales_trend || [];

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto">
      <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#dbdfe6] dark:border-gray-800">
        <div className="flex items-center p-4 pb-2 justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">dashboard_customize</span>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-tight">Super Admin</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-[#dbdfe6] dark:border-gray-700">
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
            <button className="relative flex size-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-[#dbdfe6] dark:border-gray-700">
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </div>
        </div>
        <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setPeriod('today')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 text-sm font-semibold transition-colors ${period === 'today' ? 'bg-primary text-white shadow-sm' : 'bg-white dark:bg-gray-800 border border-[#dbdfe6] dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
          >
            <span>Today</span>
            <span className="material-symbols-outlined text-lg">calendar_today</span>
          </button>
          <button
            onClick={() => setPeriod('last_7_days')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 text-sm font-semibold transition-colors ${period === 'last_7_days' ? 'bg-primary text-white shadow-sm' : 'bg-white dark:bg-gray-800 border border-[#dbdfe6] dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
          >
            <span>Last 7 Days</span>
            <span className="material-symbols-outlined text-lg">calendar_view_week</span>
          </button>
        </div>
      </header>

      <main className="p-4 space-y-4 pb-24">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-gray-800 border border-[#dbdfe6] dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-start">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Revenue</p>
              <div className={`flex items-center gap-1 ${stats.revenue_change >= 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'} px-2 py-0.5 rounded-full text-xs font-bold`}>
                <span className="material-symbols-outlined text-xs">{stats.revenue_change >= 0 ? 'trending_up' : 'trending_down'}</span>
                <span>{Math.abs(stats.revenue_change)}%</span>
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight">${stats.total_revenue.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Read-only live feed</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-gray-800 border border-[#dbdfe6] dark:border-gray-700 shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Total Stores</p>
            <p className="text-xl font-bold">{stats.total_stores}</p>
            <p className={`text-[10px] ${stats.stores_change >= 0 ? 'text-green-600' : 'text-red-600'} font-bold`}>
              {stats.stores_change >= 0 ? '+' : ''}{stats.stores_change} New
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-gray-800 border border-[#dbdfe6] dark:border-gray-700 shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Total Orders</p>
            <p className="text-xl font-bold">{stats.total_orders.toLocaleString()}</p>
            <p className={`text-[10px] ${stats.orders_change >= 0 ? 'text-green-600' : 'text-red-600'} font-bold`}>
              {stats.orders_change >= 0 ? '+' : ''}{stats.orders_change}% Vol
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-5 rounded-xl border border-[#dbdfe6] dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Sales Trend</p>
              <p className="text-2xl font-bold leading-tight">
                ${(trend.reduce((a: any, b: any) => a + b.val, 0) / (trend.length || 1)).toFixed(2)}
                <span className="text-xs font-normal text-gray-400 ml-1">avg/{period === 'today' ? 'hour' : 'day'}</span>
              </p>
            </div>
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <span className="material-symbols-outlined">show_chart</span>
            </div>
          </div>
          <div className="h-[140px] w-full min-h-[140px]">
            {trend.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#135bec" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#135bec" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="val" stroke="#135bec" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
            {trend.length === 0 && <div className="w-full h-full bg-gray-50 dark:bg-gray-900/50 rounded-lg animate-pulse" />}
          </div>
        </div>

        <section>
          <h3 className="text-base font-bold mb-4 px-1">Monitoring Modules</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate('inventory')}
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 border border-[#dbdfe6] dark:border-gray-700 rounded-2xl shadow-sm gap-3 active:scale-[0.98] transition-transform"
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 p-3 rounded-xl">
                <span className="material-symbols-outlined text-2xl">inventory_2</span>
              </div>
              <span className="font-bold text-sm">Inventory</span>
            </button>
            <button
              onClick={() => onNavigate('orders')}
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 border border-[#dbdfe6] dark:border-gray-700 rounded-2xl shadow-sm gap-3 active:scale-[0.98] transition-transform"
            >
              <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 p-3 rounded-xl">
                <span className="material-symbols-outlined text-2xl">receipt_long</span>
              </div>
              <span className="font-bold text-sm">Orders</span>
            </button>
            <button
              onClick={() => onNavigate('store-directory')}
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 border border-[#dbdfe6] dark:border-gray-700 rounded-2xl shadow-sm gap-3 active:scale-[0.98] transition-transform"
            >
              <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 p-3 rounded-xl">
                <span className="material-symbols-outlined text-2xl">storefront</span>
              </div>
              <span className="font-bold text-sm">Stores</span>
            </button>
            <button
              onClick={() => onNavigate('analytics')}
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 border border-[#dbdfe6] dark:border-gray-700 rounded-2xl shadow-sm gap-3 active:scale-[0.98] transition-transform"
            >
              <div className="bg-green-50 dark:bg-green-900/20 text-green-600 p-3 rounded-xl">
                <span className="material-symbols-outlined text-2xl">insights</span>
              </div>
              <span className="font-bold text-sm">Analytics</span>
            </button>
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-40 bg-white dark:bg-gray-900 border-t border-[#dbdfe6] dark:border-gray-800 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-20 pb-2">
          <div className="flex flex-col items-center gap-1 text-primary cursor-pointer" onClick={() => onNavigate('dashboard')}>
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

export default SuperAdminDashboard;
