import { create } from 'zustand';
import api from '../services/api';

export const useStore = create((set, get) => ({
  // Auth state
  token: localStorage.getItem('token') || null,
  user: null,
  authError: null,
  authLoading: false,

  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },

  register: async (name, email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { token, user } = res.data;
      get().setToken(token);
      set({ user, authLoading: false });
      get().fetchCart();
      return true;
    } catch (err) {
      set({ authError: err.response?.data?.message || 'Registration failed', authLoading: false });
      return false;
    }
  },

  login: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      get().setToken(token);
      set({ user, authLoading: false });
      get().fetchCart();
      return true;
    } catch (err) {
      set({ authError: err.response?.data?.message || 'Login failed', authLoading: false });
      return false;
    }
  },

  logout: () => {
    get().setToken(null);
    set({ user: null, cart: { items: [] } });
  },

  fetchMe: async () => {
    if (!get().token) return;
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data });
      get().fetchCart();
    } catch (err) {
      get().logout();
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await api.put('/auth/me', data);
      set({ user: res.data });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  requestSeller: async () => {
    try {
      const res = await api.post('/auth/request-seller');
      set({ user: res.data });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  // Products state
  products: [],
  productsLoading: false,
  selectedProduct: null,
  productLoading: false,

  fetchProducts: async () => {
    set({ productsLoading: true });
    try {
      const res = await api.get('/products');
      set({ products: res.data, productsLoading: false });
    } catch (err) {
      console.error(err);
      set({ productsLoading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ productLoading: true, selectedProduct: null });
    try {
      const res = await api.get(`/products/${id}`);
      set({ selectedProduct: res.data, productLoading: false });
    } catch (err) {
      console.error(err);
      set({ productLoading: false });
    }
  },

  // Cart state
  cart: { items: [] },
  cartLoading: false,

  fetchCart: async () => {
    if (!get().token) return;
    set({ cartLoading: true });
    try {
      const res = await api.get('/cart');
      set({ cart: res.data || { items: [] }, cartLoading: false });
    } catch (err) {
      console.error(err);
      set({ cartLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    if (!get().token) return false;
    try {
      const res = await api.post('/cart', { productId, quantity });
      set({ cart: res.data });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  updateCartItem: async (productId, quantity) => {
    try {
      const res = await api.put(`/cart/${productId}`, { quantity });
      set({ cart: res.data });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  removeCartItem: async (productId) => {
    try {
      const res = await api.delete(`/cart/${productId}`);
      set({ cart: res.data });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  clearCart: async () => {
    try {
      const res = await api.delete('/cart');
      set({ cart: res.data || { items: [] } });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  // Orders state
  orders: [],
  ordersLoading: false,

  fetchOrders: async () => {
    if (!get().token) return;
    set({ ordersLoading: true });
    try {
      const res = await api.get('/orders/myorders');
      set({ orders: res.data, ordersLoading: false });
    } catch (err) {
      console.error(err);
      set({ ordersLoading: false });
    }
  },

  placeOrder: async (address) => {
    try {
      const res = await api.post('/orders', { address });
      set({ cart: { items: [] } });
      get().fetchOrders();
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  createPaymentOrder: async (amount) => {
    try {
      const res = await api.post('/orders/pay', { amount });
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  verifyPayment: async (paymentData) => {
    try {
      const res = await api.post('/orders/verify', paymentData);
      set({ cart: { items: [] } });
      get().fetchOrders();
      return res.data.order;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}));
