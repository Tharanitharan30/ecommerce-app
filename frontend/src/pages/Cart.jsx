import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, cartLoading, fetchCart, updateCartItem, removeCartItem, token } = useStore();

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token, fetchCart]);

  if (!token) {
    return (
      <div className="text-center py-xl bg-white border border-outline-variant rounded-xl card-shadow max-w-lg mx-auto mt-lg p-lg space-y-md">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant">lock</span>
        <h3 className="font-headline text-lg font-bold text-primary">Please Sign In</h3>
        <p className="text-on-surface-variant text-sm">
          You need to be logged in to view your shopping cart.
        </p>
        <Link
          to="/login"
          className="inline-block bg-primary text-on-primary px-lg py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-all"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-md">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-on-surface-variant font-medium text-sm">Loading your cart...</p>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const tax = subtotal * 0.18; // 18% GST standard
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="text-center py-xl bg-white border border-outline-variant rounded-xl card-shadow max-w-lg mx-auto mt-lg p-lg space-y-md">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant">shopping_cart</span>
        <h3 className="font-headline text-lg font-bold text-primary">Your Cart is Empty</h3>
        <p className="text-on-surface-variant text-sm">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link
          to="/search"
          className="inline-block bg-primary text-on-primary px-lg py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-all"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const handleQtyChange = async (productId, quantity, change) => {
    const newQty = quantity + change;
    if (newQty >= 1) {
      await updateCartItem(productId, newQty);
    }
  };

  const handleRemove = async (productId) => {
    if (confirm('Are you sure you want to remove this item?')) {
      await removeCartItem(productId);
    }
  };

  return (
    <div className="space-y-md animate-fade-in">
      <h1 className="font-headline text-3xl font-black text-primary mb-xl">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-8 space-y-md">
          {items.map((item) => {
            const prod = item.product;
            if (!prod) return null;
            return (
              <div
                key={prod._id}
                className="bg-white border border-outline-variant p-md rounded-lg flex flex-col sm:flex-row gap-md shadow-sm"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-surface-container rounded-lg overflow-hidden border border-outline-variant p-2 flex items-center justify-center">
                  <img
                    className="w-full h-full object-contain"
                    src={prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150'}
                    alt={prod.name}
                  />
                </div>
                <div className="flex-grow flex flex-col justify-between py-xs">
                  <div className="flex justify-between items-start gap-md">
                    <div>
                      <h3 className="font-bold text-primary text-sm sm:text-base line-clamp-1">{prod.name}</h3>
                      <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{prod.description}</p>
                    </div>
                    <p className="font-bold text-primary text-sm sm:text-base whitespace-nowrap">
                      Rs {prod.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4 gap-md flex-wrap">
                    <div className="flex items-center gap-xs">
                      <button
                        onClick={() => handleQtyChange(prod._id, item.quantity, -1)}
                        className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container transition-colors text-primary font-bold"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-primary">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQtyChange(prod._id, item.quantity, 1)}
                        className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container transition-colors text-primary font-bold"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                    <div className="flex gap-lg items-center text-xs font-semibold">
                      <button
                        onClick={() => handleRemove(prod._id)}
                        className="text-error hover:underline flex items-center gap-xs"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Order Summary */}
        <aside className="lg:col-span-4 sticky top-24">
          <div className="bg-white border border-outline-variant rounded-lg p-lg shadow-sm space-y-lg">
            <h2 className="font-headline text-lg font-bold text-primary pb-sm border-b border-outline-variant/30">
              Order Summary
            </h2>
            <div className="space-y-sm text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-semibold text-primary">Rs {subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>GST (18%)</span>
                <span className="font-semibold text-primary">Rs {tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Shipping</span>
                <span className="text-secondary font-bold">FREE</span>
              </div>
              <div className="flex justify-between pt-md border-t border-outline-variant/30 text-base font-bold">
                <span className="text-primary">Total</span>
                <span className="text-primary text-lg">Rs {total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="pt-md space-y-md">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3 bg-secondary text-on-secondary font-bold rounded-lg shadow-md hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-sm text-sm"
              >
                Proceed to Checkout
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <div className="bg-surface-container p-sm rounded border border-outline-variant/50 flex items-center justify-center gap-sm text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
                Secure Checkout
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
