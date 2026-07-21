import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, user, placeOrder, createPaymentOrder, verifyPayment, token, fetchCart } = useStore();

  const [fullName, setFullName] = useState(user?.name || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token, fetchCart]);

  if (!token) {
    return (
      <div className="text-center py-xl bg-white border border-outline-variant rounded-xl card-shadow max-w-lg mx-auto mt-lg p-lg space-y-md">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant">lock</span>
        <h3 className="font-headline text-lg font-bold text-primary">Access Denied</h3>
        <p className="text-on-surface-variant text-sm">Please login to checkout.</p>
        <Link
          to="/login"
          className="inline-block bg-primary text-on-primary px-lg py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-all"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const items = cart?.items || [];
  if (items.length === 0) {
    return (
      <div className="text-center py-xl bg-white border border-outline-variant rounded-xl card-shadow max-w-lg mx-auto mt-lg p-lg space-y-md">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant">shopping_cart</span>
        <h3 className="font-headline text-lg font-bold text-primary">Your Cart is Empty</h3>
        <p className="text-on-surface-variant text-sm">Add products to your cart before checking out.</p>
        <Link
          to="/search"
          className="inline-block bg-primary text-on-primary px-lg py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-all"
        >
          View Catalog
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!fullName || !address || !city || !phone) {
      alert('Please fill out all shipping details.');
      setActiveStep(1);
      return;
    }

    setLoading(true);
    const completeAddress = `${fullName}, ${address}, ${city}. Phone: ${phone}`;

    if (paymentMethod === 'cod') {
      const order = await placeOrder(completeAddress);
      setLoading(false);
      if (order) {
        alert('Order placed successfully (Cash on Delivery)!');
        navigate('/account');
      } else {
        alert('Failed to place order.');
      }
    } else {
      // Razorpay Payment Flow
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setLoading(false);
        alert('Failed to load Razorpay SDK. Check your internet connection.');
        return;
      }

      // Create Payment Order in Backend
      const paymentOrder = await createPaymentOrder(total);
      if (!paymentOrder) {
        setLoading(false);
        alert('Failed to initialize Razorpay payment. Please use COD.');
        return;
      }

      const options = {
        key: paymentOrder.key,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'ProMarket Retail',
        description: 'Purchase Payment',
        order_id: paymentOrder.orderId,
        handler: async (response) => {
          setLoading(true);
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            cartItems: items.map((item) => ({
              product: item.product._id,
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price,
            })),
            totalPrice: total,
            address: completeAddress,
          };

          const order = await verifyPayment(verifyData);
          setLoading(false);
          if (order) {
            alert('Payment verified & order placed successfully!');
            navigate('/account');
          } else {
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: fullName,
          email: user?.email || '',
          contact: phone,
        },
        theme: {
          color: '#051125',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    }
  };

  return (
    <div className="space-y-md animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Left Columns: Steps */}
        <div className="lg:col-span-8 space-y-md">
          {/* Step 1: Shipping Address */}
          <section
            className={`bg-white p-lg shadow-sm border border-outline-variant/30 rounded-lg transition-all duration-300 ${
              activeStep === 1 ? 'border-l-4 border-l-primary' : 'opacity-70'
            }`}
          >
            <div
              className="flex items-center gap-md mb-lg cursor-pointer"
              onClick={() => setActiveStep(1)}
            >
              <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                1
              </span>
              <h2 className="font-headline text-lg font-bold text-primary">Shipping Address</h2>
            </div>

            {activeStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md pt-2">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-on-surface-variant mb-xs">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Johnathan Smith"
                    className="w-full p-sm bg-surface-container border border-outline-variant rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-on-surface-variant mb-xs">Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Commerce Way, Ste 400"
                    className="w-full p-sm bg-surface-container border border-outline-variant rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-xs">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="San Francisco"
                    className="w-full p-sm bg-surface-container border border-outline-variant rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-xs">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 99999 99999"
                    className="w-full p-sm bg-surface-container border border-outline-variant rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end mt-md">
                  <button
                    type="button"
                    onClick={() => {
                      if (fullName && address && city && phone) {
                        setActiveStep(2);
                      } else {
                        alert('Please fill out all shipping details.');
                      }
                    }}
                    className="px-xl py-2 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-all text-sm"
                  >
                    Next: Payment
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Step 2: Payment Method */}
          <section
            className={`bg-white p-lg shadow-sm border border-outline-variant/30 rounded-lg transition-all duration-300 ${
              activeStep === 2 ? 'border-l-4 border-l-primary' : 'opacity-70'
            }`}
          >
            <div
              className="flex items-center gap-md mb-lg cursor-pointer"
              onClick={() => {
                if (fullName && address && city && phone) {
                  setActiveStep(2);
                }
              }}
            >
              <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                2
              </span>
              <h2 className="font-headline text-lg font-bold text-primary">Payment Method</h2>
            </div>

            {activeStep === 2 && (
              <div className="space-y-md pt-2">
                <div className="grid grid-cols-2 gap-sm">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`flex flex-col items-center justify-center p-md border-2 rounded-lg transition-all ${
                      paymentMethod === 'razorpay'
                        ? 'border-primary bg-surface-container-low font-bold text-primary'
                        : 'border-outline-variant hover:bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined mb-xs">credit_card</span>
                    <span className="text-xs">Razorpay Online</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex flex-col items-center justify-center p-md border-2 rounded-lg transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-primary bg-surface-container-low font-bold text-primary'
                        : 'border-outline-variant hover:bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined mb-xs">payments</span>
                    <span className="text-xs">Cash On Delivery</span>
                  </button>
                </div>

                <div className="pt-lg flex justify-between items-center mt-md border-t border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="text-primary hover:underline font-bold text-xs"
                  >
                    Back to Shipping
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handlePlaceOrder}
                    className="px-xl py-2 bg-secondary text-on-secondary font-bold rounded-lg hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-on-secondary border-t-transparent rounded-full animate-spin"></span>
                    ) : paymentMethod === 'razorpay' ? (
                      'Pay & Complete Order'
                    ) : (
                      'Place COD Order'
                    )}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Columns: Summary */}
        <aside className="lg:col-span-4">
          <div className="bg-white p-lg border border-outline-variant/30 rounded-lg sticky top-24 shadow-sm space-y-lg">
            <h3 className="font-headline text-lg font-bold text-primary pb-sm border-b border-outline-variant/30">
              Order Summary
            </h3>

            {/* Item List */}
            <div className="space-y-md max-h-64 overflow-y-auto pr-2 hide-scrollbar">
              {items.map((item) => {
                const prod = item.product;
                if (!prod) return null;
                return (
                  <div key={prod._id} className="flex gap-md">
                    <div className="w-16 h-16 bg-surface-container rounded border border-outline-variant flex-shrink-0 p-1 flex items-center justify-center">
                      <img
                        className="w-full h-full object-contain"
                        src={prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80'}
                        alt={prod.name}
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-xs font-bold text-primary line-clamp-1">{prod.name}</h4>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">Qty: {item.quantity}</p>
                      <p className="text-xs font-bold mt-1 text-primary">
                        Rs {prod.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pricing details */}
            <div className="space-y-sm pt-lg border-t border-outline-variant/30 text-sm">
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
                <span className="text-secondary font-bold">Free</span>
              </div>
              <div className="flex justify-between pt-md border-t border-outline-variant/30 text-base font-bold">
                <span className="text-primary">Total</span>
                <span className="text-primary">Rs {total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
