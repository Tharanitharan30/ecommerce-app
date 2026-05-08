import { create } from 'zustand';
import api from '../services/api';

const useCartStore = create((set) => ({
  cart: null,

  fetchCart: async () => {
    const { data } = await api.get('/cart');
    set({ cart: data });
  },

  addToCart: async (productId, quantity = 1) => {
    const { data } = await api.post('/cart', { productId, quantity });
    set({ cart: data });
  },

  updateItem: async (productId, quantity) => {
    const { data } = await api.put(`/cart/${productId}`, { quantity });
    set({ cart: data });
  },

  removeItem: async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    set({ cart: data });
  },

  clearCart: () => set({ cart: null }),
}));

export default useCartStore;