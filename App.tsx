
import React, { useState, useEffect } from 'react';
import { AppType, SuperAdminView } from './types.ts';
import { superAdminApi } from './api.ts';
import SuperAdminLogin from './components/super-admin/SuperAdminLogin.tsx';
import SuperAdminDashboard from './components/super-admin/SuperAdminDashboard.tsx';
import SuperAdminInventory from './components/super-admin/SuperAdminInventory.tsx';
import SuperAdminProductDetail from './components/super-admin/SuperAdminProductDetail.tsx';
import SuperAdminOrders from './components/super-admin/SuperAdminOrders.tsx';
import SuperAdminOrderDetail from './components/super-admin/SuperAdminOrderDetail.tsx';
import SuperAdminAnalytics from './components/super-admin/SuperAdminAnalytics.tsx';
import SuperAdminStoreDirectory from './components/super-admin/SuperAdminStoreDirectory.tsx';
import SuperAdminProfile from './components/super-admin/SuperAdminProfile.tsx';
import StoreAdminInsight from './components/super-admin/StoreAdminInsight.tsx';
import StoreAdminStock from './components/super-admin/StoreAdminStock.tsx';
import StoreAdminStaff from './components/super-admin/StoreAdminStaff.tsx';
import StoreAdminSettings from './components/super-admin/StoreAdminSettings.tsx';
import { ToastProvider } from './components/Toast.tsx';

const App: React.FC = () => {
  const [appType, setAppType] = useState<AppType>('auth');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [superView, setSuperView] = useState<SuperAdminView>('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('super_admin_token');
      if (token) {
        try {
          const res = await superAdminApi.getUser();
          if (res.success) {
            setUser(res.data.user);
            setAppType('super-admin');
          } else {
            localStorage.removeItem('super_admin_token');
          }
        } catch (err) {
          localStorage.removeItem('super_admin_token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const navigateToSuper = (view: SuperAdminView, id?: string) => {
    setSuperView(view);
    if (id) {
      if (view === 'product-detail') setSelectedProductId(id);
      if (view === 'order-detail') setSelectedOrderId(id);
      if (view === 'store-insight') setSelectedStoreId(id);
    }
  };

  const handleLogin = (userData: any, token: string) => {
    localStorage.setItem('super_admin_token', token);
    setUser(userData);
    setAppType('super-admin');
    setSuperView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('super_admin_token');
    setUser(null);
    setAppType('auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
        <div className="relative mx-auto w-full max-w-[430px] min-h-screen bg-white dark:bg-background-dark shadow-2xl overflow-hidden flex flex-col">
          {appType === 'auth' && <SuperAdminLogin onLogin={handleLogin} />}

          {appType === 'super-admin' && (
            <>
              {superView === 'dashboard' && <SuperAdminDashboard onNavigate={navigateToSuper} />}
              {superView === 'inventory' && <SuperAdminInventory onNavigate={navigateToSuper} />}
              {superView === 'product-detail' && <SuperAdminProductDetail productId={selectedProductId} onBack={() => navigateToSuper('inventory')} />}
              {superView === 'orders' && <SuperAdminOrders onNavigate={navigateToSuper} />}
              {superView === 'order-detail' && <SuperAdminOrderDetail orderId={selectedOrderId} onBack={() => navigateToSuper('orders')} />}
              {superView === 'analytics' && <SuperAdminAnalytics onNavigate={navigateToSuper} />}
              {superView === 'store-directory' && <SuperAdminStoreDirectory onNavigate={navigateToSuper} />}
              {superView === 'profile' && <SuperAdminProfile onLogout={handleLogout} onBack={() => navigateToSuper('dashboard')} onNavigate={navigateToSuper} />}

              {/* Integrated Store Views */}
              {superView === 'store-insight' && <StoreAdminInsight onNavigate={navigateToSuper} storeId={selectedStoreId} onBack={() => navigateToSuper('store-directory')} />}
              {superView === 'store-stock' && <StoreAdminStock onNavigate={navigateToSuper} storeId={selectedStoreId} />}
              {superView === 'store-staff' && <StoreAdminStaff onNavigate={navigateToSuper} storeId={selectedStoreId} />}
              {superView === 'store-settings' && <StoreAdminSettings onNavigate={navigateToSuper} storeId={selectedStoreId} onLogout={handleLogout} />}
            </>
          )}
        </div>
      </div>
    </ToastProvider>
  );
};

export default App;
