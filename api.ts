
const BASE_URL = 'https://sultan.quicdeal.in/api/v1';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('super_admin_token');

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...((options.headers as any) || {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('super_admin_token');
    window.location.reload(); // Simple way to reset state
  }

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong') as any;
    error.errors = data.errors;
    throw error;
  }

  return data;
};

export const superAdminApi = {
  login: (credentials: any) => apiFetch('/super-admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getDashboard: () => apiFetch('/super-admin/dashboard'),
  getProducts: (params: string = '') => apiFetch(`/super-admin/products${params}`),
  getOrders: (params: string = '') => apiFetch(`/super-admin/orders${params}`),
  getStores: () => apiFetch('/super-admin/stores'),
  getAnalytics: () => apiFetch('/super-admin/analytics'),
  getUser: () => apiFetch('/super-admin/user'),
  getStore: (id: string) => apiFetch(`/super-admin/stores/${id}`),
  updateStore: (id: string, data: any) => apiFetch(`/super-admin/stores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getOrder: (id: string) => apiFetch(`/super-admin/orders/${id}`),
  getProduct: (id: string) => apiFetch(`/super-admin/products/${id}`),

  // Staff Management
  addStaff: (data: any) => apiFetch(`/super-admin/staff`, { method: 'POST', body: JSON.stringify(data) }),
  updateStaff: (id: string, data: any) => apiFetch(`/super-admin/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  removeStaff: (id: string) => apiFetch(`/super-admin/staff/${id}`, { method: 'DELETE' }),

  // Stock Management (Store specific)
  updateStoreStock: (storeId: string, productId: string, quantity: number) =>
    apiFetch(`/super-admin/stores/${storeId}/stock/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity })
    }),
};
