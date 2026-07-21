import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, authError, authLoading } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate(-1); // Go back or go home
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-xl bg-white border border-outline-variant p-lg rounded-xl shadow-sm space-y-lg animate-fade-in">
      <div>
        <h1 className="font-headline text-2xl font-black text-primary">Sign In to ProMarket</h1>
        <p className="text-xs text-on-surface-variant mt-1">Enter your email and password to log in.</p>
      </div>

      {authError && (
        <div className="bg-error-container text-on-error-container text-sm p-sm rounded-lg font-medium border border-error/20">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-md">
        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full p-sm bg-surface-container border border-outline-variant rounded-lg text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full p-sm bg-surface-container border border-outline-variant rounded-lg text-sm outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={authLoading}
          className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:bg-primary-container disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-2 shadow-sm"
        >
          {authLoading ? (
            <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="text-center text-xs text-on-surface-variant pt-md border-t border-outline-variant/30">
        New to ProMarket?{' '}
        <Link to="/register" className="text-secondary font-bold hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  );
}
