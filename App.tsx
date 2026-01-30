
import React, { useState } from 'react';
import { AppType, SuperAdminView } from './types.ts';
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

const App: React.FC = () => {
  const [appType, setAppType] = useState<AppType>('auth');
  const [superView, setSuperView] = useState<SuperAdminView>('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  const navigateToSuper = (view: SuperAdminView, id?: string) => {
    setSuperView(view);
    if (id) {
      if (view === 'product-detail') setSelectedProductId(id);
      if (view === 'order-detail') setSelectedOrderId(id);
      if (view === 'store-insight') setSelectedStoreId(id);
    }
  };

  const handleLogin = (type: 'super' | 'store') => {
    setAppType('super-admin');
    if (type === 'store') {
        setSuperView('store-directory');
    } else {
        setSuperView('dashboard');
    }
  };

  const handleLogout = () => {
    setAppType('auth');
  };

  return (
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
            {superView === 'store-stock' && <StoreAdminStock onNavigate={navigateToSuper} />}
            {superView === 'store-staff' && <StoreAdminStaff onNavigate={navigateToSuper} />}
            {superView === 'store-settings' && <StoreAdminSettings onNavigate={navigateToSuper} onLogout={handleLogout} />}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
