import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedProduct, fetchProductById, productLoading, addToCart, token } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Specifications');

  useEffect(() => {
    fetchProductById(id);
  }, [id, fetchProductById]);

  if (productLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-md">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-on-surface-variant font-medium text-sm">Loading product details...</p>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="text-center py-xl bg-white border border-outline-variant rounded-xl card-shadow max-w-lg mx-auto mt-lg">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-md">warning</span>
        <h3 className="font-headline text-lg font-bold text-primary mb-sm">Product Not Found</h3>
        <p className="text-on-surface-variant text-sm mb-lg">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/search"
          className="bg-primary text-on-primary px-lg py-2 rounded-lg font-bold text-sm hover:opacity-90"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  const handleQuantityChange = (val) => {
    if (val >= 1 && val <= selectedProduct.stock) {
      setQuantity(val);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    const success = await addToCart(selectedProduct._id, quantity);
    if (success) {
      alert(`${selectedProduct.name} added to cart!`);
    }
  };

  const handleBuyNow = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    const success = await addToCart(selectedProduct._id, quantity);
    if (success) {
      navigate('/cart');
    }
  };

  return (
    <div className="space-y-xl animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-xs text-on-surface-variant text-[11px] mb-sm font-medium">
        <Link className="hover:text-primary transition-colors" to="/">Home</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link className="hover:text-primary transition-colors" to={`/search?category=${selectedProduct.category}`}>
          {selectedProduct.category}
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-primary font-semibold truncate max-w-[200px]">{selectedProduct.name}</span>
      </nav>

      {/* Product Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl mb-xl">
        {/* Left Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-md">
          <div className="relative group bg-white rounded-xl overflow-hidden border border-outline-variant aspect-square flex items-center justify-center p-md card-shadow">
            <img
              className="w-full h-full object-contain max-h-[450px] transition-transform duration-300 hover:scale-105"
              src={selectedProduct.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
              alt={selectedProduct.name}
            />
          </div>
        </div>

        {/* Right Info */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-md">
            <div>
              <span className="bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider">
                {selectedProduct.category}
              </span>
            </div>
            <h1 className="font-headline text-2xl md:text-3xl font-black text-primary leading-tight">
              {selectedProduct.name}
            </h1>
            <div className="flex items-center gap-md border-b border-outline-variant/30 pb-sm">
              <div className="flex text-secondary">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="text-on-surface-variant text-xs border-l border-outline-variant pl-md">
                124 reviews
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-bold text-2xl text-primary">
                Rs {selectedProduct.price.toLocaleString('en-IN')}
              </span>
              <p className="text-xs text-on-surface-variant mt-1">Inclusive of all taxes</p>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              {selectedProduct.description}
            </p>

            <div className="flex items-center gap-xs">
              {selectedProduct.stock > 0 ? (
                <>
                  <span className="material-symbols-outlined text-success">check_circle</span>
                  <span className="text-on-surface font-semibold text-sm">In Stock</span>
                  <span className="text-xs text-on-surface-variant ml-sm">
                    ({selectedProduct.stock} items left)
                  </span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-error">cancel</span>
                  <span className="text-on-surface font-semibold text-sm text-error">Out of Stock</span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-lg mt-8 pt-md border-t border-outline-variant/30">
            {selectedProduct.stock > 0 && (
              <div className="flex flex-col gap-xs">
                <span className="font-bold text-sm text-primary">Quantity</span>
                <div className="flex items-center w-32 border border-outline-variant rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-surface-container transition-colors border-r border-outline-variant text-primary"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center font-bold text-sm text-primary">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-surface-container transition-colors border-l border-outline-variant text-primary"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <button
                disabled={selectedProduct.stock <= 0}
                onClick={handleAddToCart}
                className="bg-secondary text-on-secondary py-3 px-lg rounded-lg font-bold hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-sm text-sm active:scale-[0.98] shadow-sm"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                Add to Cart
              </button>
              <button
                disabled={selectedProduct.stock <= 0}
                onClick={handleBuyNow}
                className="bg-primary text-on-primary py-3 px-lg rounded-lg font-bold hover:bg-primary-container disabled:opacity-50 transition-all flex items-center justify-center gap-sm text-sm active:scale-[0.98] border border-primary shadow-sm"
              >
                Buy Now
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-outline-variant/30 pt-lg mt-md">
              <div className="flex items-center gap-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-lg">local_shipping</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Free Shipping</span>
              </div>
              <div className="flex items-center gap-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-lg">verified_user</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">1-Year Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Specifications */}
      <div className="mb-xl">
        <div className="flex border-b border-outline-variant/30 mb-lg">
          {['Specifications', 'Shipping & Delivery', 'Reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-lg py-3 text-sm font-bold transition-all ${
                activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Specifications' && (
          <div className="rounded-xl border border-outline-variant overflow-hidden bg-white max-w-2xl card-shadow">
            <table className="w-full text-left border-collapse text-sm">
              <tbody>
                <tr className="bg-surface-container-low border-b border-outline-variant/20">
                  <th className="py-md px-lg font-bold w-1/3">Category</th>
                  <td className="py-md px-lg">{selectedProduct.category}</td>
                </tr>
                <tr className="border-b border-outline-variant/20">
                  <th className="py-md px-lg font-bold">Standard Price</th>
                  <td className="py-md px-lg">Rs {selectedProduct.price.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-surface-container-low border-b border-outline-variant/20">
                  <th className="py-md px-lg font-bold">In-Stock Available</th>
                  <td className="py-md px-lg">{selectedProduct.stock} units</td>
                </tr>
                <tr>
                  <th className="py-md px-lg font-bold">Availability Status</th>
                  <td className="py-md px-lg">{selectedProduct.stock > 0 ? 'Available for Purchase' : 'Out of Stock'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Shipping & Delivery' && (
          <div className="p-lg bg-white rounded-xl border border-outline-variant max-w-2xl text-sm leading-relaxed text-on-surface-variant space-y-sm card-shadow">
            <p><strong>Free Express Delivery:</strong> All orders are dispatched within 24 business hours. Typical transit times range between 2 to 5 business days depending on location.</p>
            <p><strong>Package contents protection:</strong> Insured shipping with discrete packaging.</p>
          </div>
        )}

        {activeTab === 'Reviews' && (
          <div className="p-lg bg-white rounded-xl border border-outline-variant max-w-2xl text-sm leading-relaxed text-on-surface-variant space-y-md card-shadow">
            <div className="flex items-center gap-md">
              <div className="text-center bg-surface-container p-lg rounded-xl">
                <span className="block text-3xl font-black text-primary">4.8</span>
                <span className="text-[10px] uppercase font-bold tracking-wider">out of 5</span>
              </div>
              <p className="text-xs">Based on 124 reviews verified across purchases.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
