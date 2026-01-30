
export type AppType = 'super-admin' | 'auth';

// Fix: Add StoreAdminView which is used by components in store-admin directory to resolve import errors
export type StoreAdminView = 'insight' | 'stock' | 'staff' | 'settings';

export type SuperAdminView = 
  | 'dashboard'
  | 'inventory'
  | 'product-detail'
  | 'orders'
  | 'order-detail'
  | 'analytics'
  | 'store-directory'
  | 'store-insight'
  | 'store-stock'
  | 'store-staff'
  | 'store-settings'
  | 'profile';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  imageUrl: string;
}

export interface Order {
  id: string;
  customer: string;
  store: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'In Transit' | 'Refunded';
  timestamp: string;
}