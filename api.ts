
export const formatPrice = (price: number | string) => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return `₹${Math.round(num || 0).toLocaleString('en-IN')}`;
};

// Automatically detect if running locally or on production
const isLocalhost = window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '[::1]';

const BASE_URL = isLocalhost
  ? 'http://localhost:8000/api/v1'
  : 'https://sultan.quicdeal.in/api/v1';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('super_admin_token');

  const headers: any = {
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...((options.headers as any) || {}),
  };

  // Only set Content-Type if not FormData (Fetch automatically handles boundary for FormData)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

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
  getDashboard: (params: string = '') => apiFetch(`/super-admin/dashboard${params}`),
  getProducts: (params: string = '') => apiFetch(`/super-admin/products${params}`),
  getOrders: (params: string = '') => apiFetch(`/super-admin/orders${params}`),
  getStores: (params: string = '') => apiFetch(`/super-admin/stores${params}`),
  getAnalytics: () => apiFetch('/super-admin/analytics'),
  getUser: () => apiFetch('/super-admin/user'),
  updateProfile: (data: any) => apiFetch('/super-admin/profile', { method: 'PUT', body: JSON.stringify(data) }),
  updatePassword: (data: any) => apiFetch('/super-admin/password', { method: 'PUT', body: JSON.stringify(data) }),
  updateAvatar: (formData: FormData) => apiFetch('/super-admin/avatar', { method: 'POST', body: formData }),
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
