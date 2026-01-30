
import React, { useState } from 'react';
import { AppType, SuperAdminView } from './types';
import SuperAdminLogin from './components/super-admin/SuperAdminLogin';
import SuperAdminDashboard from './components/super-admin/SuperAdminDashboard';
import SuperAdminInventory from './components/super-admin/SuperAdminInventory';
import SuperAdminProductDetail from './components/super-admin/SuperAdminProductDetail';
import SuperAdminOrders from './components/super-admin/SuperAdminOrders';
import SuperAdminOrderDetail from './components/super-admin/SuperAdminOrderDetail';
import SuperAdminAnalytics from './components/super-admin/SuperAdminAnalytics';
import SuperAdminStoreDirectory from './components/super-admin/SuperAdminStoreDirectory';
import SuperAdminProfile from './components/super-admin/SuperAdminProfile';
import StoreAdminInsight from './components/super-admin/StoreAdminInsight';
import StoreAdminStock from './components/super-admin/StoreAdminStock';
import StoreAdminStaff from './components/super-admin/StoreAdminStaff';
import StoreAdminSettings from './components/super-admin/StoreAdminSettings';

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
