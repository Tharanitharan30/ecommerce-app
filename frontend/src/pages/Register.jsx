import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Register() {
  const navigate = useNavigate();
  const { register, authError, authLoading } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-xl bg-white border border-outline-variant p-lg rounded-xl shadow-sm space-y-lg animate-fade-in">
      <div>
        <h1 className="font-headline text-2xl font-black text-primary">Create an Account</h1>
        <p className="text-xs text-on-surface-variant mt-1">Get started with your free ProMarket account.</p>
      </div>

      {authError && (
        <div className="bg-error-container text-on-error-container text-sm p-sm rounded-lg font-medium border border-error/20">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-md">
        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="John Doe"
            className="w-full p-sm bg-surface-container border border-outline-variant rounded-lg text-sm outline-none focus:border-primary"
          />
        </div>

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
          <label className="block text-xs font-bold text-on-surface-variant mb-1">Password (min 6 characters)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
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
            'Register'
          )}
        </button>
      </form>

      <div className="text-center text-xs text-on-surface-variant pt-md border-t border-outline-variant/30">
        Already have an account?{' '}
        <Link to="/login" className="text-secondary font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
