import { useState } from 'react';
import { useStore } from '../store/useStore';

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, authError, authLoading } = useStore();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;
    if (isLogin) {
      success = await login(email, password);
    } else {
      success = await register(name, email, password);
    }
    if (success) {
      setName('');
      setEmail('');
      setPassword('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-md">
      <div className="bg-surface border border-outline-variant rounded-xl max-w-md w-full p-lg relative card-shadow animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h3 className="font-headline-md text-headline-md text-primary font-bold mb-md">
          {isLogin ? 'Sign In to ProMarket' : 'Create an Account'}
        </h3>

        {authError && (
          <div className="bg-error-container text-on-error-container text-sm p-sm rounded-lg mb-md font-medium border border-error/20">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-md">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="w-full bg-surface-container border border-outline-variant rounded-lg py-2 px-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full bg-surface-container border border-outline-variant rounded-lg py-2 px-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-surface-container border border-outline-variant rounded-lg py-2 px-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-primary text-on-primary py-2 rounded-lg font-bold hover:bg-primary-container active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2"
          >
            {authLoading ? (
              <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Register'
            )}
          </button>
        </form>

        <div className="mt-lg pt-md border-t border-outline-variant text-center text-sm text-on-surface-variant">
          {isLogin ? (
            <p>
              New to ProMarket?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-secondary font-bold hover:underline"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-secondary font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
