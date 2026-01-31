
import React, { useEffect, useState } from 'react';
import { SuperAdminView } from '../../types.ts';
import { superAdminApi, formatPrice } from '../../api.ts';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface Props {
  onNavigate: (view: SuperAdminView) => void;
}

const SuperAdminDashboard: React.FC<Props> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('today');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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

  const periods = [
    { label: 'Today', value: 'today', icon: 'today' },
    { label: 'Last 7 Days', value: 'last_7_days', icon: 'date_range' },
    { label: 'Last 30 Days', value: 'last_30_days', icon: 'calendar_month' },
    { label: 'This Month', value: 'this_month', icon: 'event_repeat' }
  ];

  if (loading && !data) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark">
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
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto relative">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-[#dbdfe6] dark:border-gray-800">
        <div className="flex items-center p-4 pb-2 justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-xl">dashboard_customize</span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">Super Admin</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSearch(true)}
              className="flex size-11 items-center justify-center rounded-full bg-white dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 shadow-sm active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
            <button
              onClick={() => setShowNotifications(true)}
              className="relative flex size-11 items-center justify-center rounded-full bg-white dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 shadow-sm active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-gray-800"></span>
            </button>
          </div>
        </div>
        <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar">
          {periods.slice(0, 2).map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-2xl px-5 text-sm font-black transition-all shadow-sm ${period === p.value ? 'bg-primary text-white shadow-primary/20' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500'}`}
            >
              <span>{p.label}</span>
              <span className="material-symbols-outlined text-lg">{p.icon}</span>
            </button>
          ))}
          <button
            onClick={() => setShowCalendar(true)}
            className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-2xl px-5 text-sm font-black bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500"
          >
            <span>Period</span>
            <span className="material-symbols-outlined text-lg">expand_more</span>
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
            <p className="text-2xl font-bold tracking-tight">{formatPrice(stats.total_revenue)}</p>
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
                {formatPrice(trend.reduce((a: any, b: any) => a + b.val, 0) / (trend.length || 1))}
                <span className="text-xs font-normal text-gray-400 ml-1">avg/{period === 'today' ? 'hour' : 'day'}</span>
              </p>
            </div>
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <span className="material-symbols-outlined">show_chart</span>
            </div>
          </div>
          <div className="h-[140px] w-full min-h-[140px]" key={period}>
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
                <span className="material-symbols-outlined text-2xl">inventory</span>
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
        <div className="text-center pb-8">
          <p className="text-[10px] text-gray-400 font-medium italic">Last updated: {new Date().toLocaleTimeString()} for {periods.find(p => p.value === period)?.label}</p>
        </div>
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

      {/* Calendar Selection Sheet */}
      {showCalendar && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[100] animate-in fade-in duration-300" onClick={() => setShowCalendar(false)} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white dark:bg-gray-900 rounded-t-[32px] z-[101] p-8 pb-12 animate-in slide-in-from-bottom duration-500 shadow-2xl">
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-8" />
            <h3 className="text-xl font-black mb-6">Select Reporting Period</h3>
            <div className="space-y-3">
              {periods.map((p) => (
                <button
                  key={p.value}
                  onClick={() => { setPeriod(p.value); setShowCalendar(false); }}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all active:scale-[0.98] ${period === p.value
                    ? 'bg-primary/5 border-primary text-primary'
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined">{p.icon}</span>
                    <span className="font-bold">{p.label}</span>
                  </div>
                  {period === p.value && <span className="material-symbols-outlined">check_circle</span>}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Search Sheet */}
      {showSearch && (
        <div className="fixed inset-0 bg-white dark:bg-gray-950 z-[200] animate-in slide-in-from-top duration-300 flex flex-col">
          <header className="p-4 flex items-center gap-4 border-b dark:border-gray-800">
            <button onClick={() => setShowSearch(false)} className="size-10 flex items-center justify-center">
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input
                autoFocus
                type="search"
                placeholder="Search stores, orders, or SKUs..."
                className="w-full h-12 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl pl-10 pr-4 outline-none focus:ring-2 ring-primary/20"
                onChange={(e) => {
                  const val = e.target.value.toLowerCase();
                  if (val.length > 2) {
                    // Simple local search implementation for demo
                    const filteredStores = data?.stores?.filter((s: any) => s.name.toLowerCase().includes(val)) || [];
                    // For real implementation, this would call an API
                  }
                }}
              />
            </div>
          </header>
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-8">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Quick Shortcuts</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => { onNavigate('store-directory'); setShowSearch(false); }} className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl text-center space-y-2 border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform">
                  <span className="material-symbols-outlined text-primary text-3xl">storefront</span>
                  <p className="font-bold text-sm">Find Store</p>
                </button>
                <button onClick={() => { onNavigate('orders'); setShowSearch(false); }} className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl text-center space-y-2 border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform">
                  <span className="material-symbols-outlined text-primary text-3xl">receipt_long</span>
                  <p className="font-bold text-sm">Find Order</p>
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Popular Actions</p>
              <div className="space-y-3">
                {['Add New Store', 'Inventory Audit', 'System Health'].map((action) => (
                  <button key={action} className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl active:bg-gray-50">
                    <span className="font-bold text-sm">{action}</span>
                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Sheet */}
      {showNotifications && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[100] animate-in fade-in duration-300" onClick={() => setShowNotifications(false)} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white dark:bg-gray-900 rounded-t-[32px] z-[101] p-8 pb-12 animate-in slide-in-from-bottom duration-500 shadow-2xl h-[70vh] flex flex-col">
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-8 shrink-0" />
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="text-xl font-black">System Notifications</h3>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">3 New</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
              {[
                { title: 'New Store Application', body: 'Luxury Jewels Ltd has applied for a store license.', time: '2 mins ago', icon: 'storefront', color: 'bg-blue-100 text-blue-600' },
                { title: 'Goal Achieved!', body: 'Global revenue milestone of ₹10L reached for this month.', time: '1 hour ago', icon: 'emoji_events', color: 'bg-green-100 text-green-600' },
                { title: 'Stock Alert', body: 'Downtown Flagship is running low on Gold Rings SKU-001.', time: '5 hours ago', icon: 'warning', color: 'bg-amber-100 text-amber-600' },
              ].map((n, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-3xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                  <div className={`size-12 shrink-0 rounded-2xl flex items-center justify-center ${n.color}`}>
                    <span className="material-symbols-outlined">{n.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-sm leading-tight mb-1">{n.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{n.body}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowNotifications(false)}
              className="w-full h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl mt-6 shrink-0 active:scale-95 transition-transform"
            >
              Mark All Read
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
