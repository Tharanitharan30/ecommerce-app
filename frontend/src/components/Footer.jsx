import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant full-width mt-12">
      <div className="max-w-container-max mx-auto px-gutter py-xl grid grid-cols-1 md:grid-cols-4 gap-lg">
        {/* Brand Column */}
        <div className="col-span-1">
          <Link to="/" className="font-headline font-black text-2xl text-primary tracking-tighter">
            ProMarket
          </Link>
          <p className="mt-md text-on-surface-variant text-sm leading-relaxed">
            Professional grade marketplace providing curated products for the modern lifestyle. Quality, efficiency, and reliability in every transaction.
          </p>
          <div className="flex gap-md mt-lg">
            <a className="text-on-surface-variant hover:text-secondary transition-colors" href="#">
              <span className="material-symbols-outlined">public</span>
            </a>
            <a className="text-on-surface-variant hover:text-secondary transition-colors" href="#">
              <span className="material-symbols-outlined">alternate_email</span>
            </a>
            <a className="text-on-surface-variant hover:text-secondary transition-colors" href="#">
              <span className="material-symbols-outlined">share</span>
            </a>
          </div>
        </div>

        {/* Links Columns */}
        <div>
          <h5 className="font-bold text-on-surface mb-lg text-sm uppercase tracking-wider">Shop</h5>
          <ul className="space-y-sm text-on-surface-variant text-sm">
            <li><Link className="hover:text-secondary transition-colors" to="/search?category=Electronics">Electronics</Link></li>
            <li><Link className="hover:text-secondary transition-colors" to="/search?category=Clothing">Clothing</Link></li>
            <li><Link className="hover:text-secondary transition-colors" to="/search?category=Footwear">Footwear</Link></li>
            <li><Link className="hover:text-secondary transition-colors" to="/search?category=Bags">Bags</Link></li>
            <li><Link className="hover:text-secondary transition-colors" to="/search?category=Accessories">Accessories</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-on-surface mb-lg text-sm uppercase tracking-wider">Support</h5>
          <ul className="space-y-sm text-on-surface-variant text-sm">
            <li><a className="hover:text-secondary transition-colors" href="#">Help Center</a></li>
            <li><a className="hover:text-secondary transition-colors" href="#">Returns &amp; Refunds</a></li>
            <li><a className="hover:text-secondary transition-colors" href="#">Shipping Policy</a></li>
            <li><a className="hover:text-secondary transition-colors" href="#">Privacy Policy</a></li>
            <li><a className="hover:text-secondary transition-colors" href="#">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-on-surface mb-lg text-sm uppercase tracking-wider">Newsletter</h5>
          <p className="text-on-surface-variant text-sm mb-md">Subscribe for early access to sales and exclusive content.</p>
          <div className="flex gap-xs">
            <input
              className="flex-1 bg-surface-container border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-primary outline-none text-sm"
              placeholder="Your email"
              type="email"
            />
            <button className="bg-primary text-on-primary px-md py-sm rounded-lg font-bold text-sm">Join</button>
          </div>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-gutter py-md border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-md">
        <p className="text-on-surface-variant text-sm">© 2026 ProMarket Retail. All rights reserved.</p>
        <div className="flex gap-lg opacity-60">
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Verified Payments</span>
        </div>
      </div>
    </footer>
  );
}
