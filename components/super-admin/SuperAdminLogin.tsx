import React, { useState } from 'react';
import { superAdminApi } from '../../api.ts';

interface Props {
  onLogin: (userData: any, token: string) => void;
}

const SuperAdminLogin: React.FC<Props> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('admin@sultan.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<any>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      const res = await superAdminApi.login({ email, password });
      if (res.success) {
        onLogin(res.data.user, res.data.token);
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err: any) {
      if (err.errors) {
        setFieldErrors(err.errors);
      } else {
        setError(err.message || 'Failed to connect to server');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-6 bg-white dark:bg-background-dark overflow-y-auto">
      <div className="flex items-center p-4 pb-2 justify-between mt-8">
        <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Super Admin
        </h2>
      </div>

      <div className="mt-12 mb-8 flex flex-col items-center">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
            <span className="material-symbols-outlined !text-5xl">storefront</span>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#111318] dark:text-white">Retail Monitor</h1>
          <p className="text-sm text-[#616f89] dark:text-gray-400 mt-1">Enterprise Monitoring Console</p>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4" noValidate>
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 animate-shake">
            {error}
          </div>
        )}
        <div className="flex flex-col w-full">
          <p className="text-[#111318] dark:text-white text-sm font-semibold leading-normal pb-2">Email / Username</p>
          <input
            className={`form-input flex w-full rounded-lg text-[#111318] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-gray-800 h-14 placeholder:text-[#616f89] p-[15px] text-base font-normal ${fieldErrors.email ? 'ring-2 ring-red-500' : ''}`}
            placeholder="Enter your email or username"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldErrors.email && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{fieldErrors.email[0]}</p>}
        </div>

        <div className="flex flex-col w-full">
          <p className="text-[#111318] dark:text-white text-sm font-semibold leading-normal pb-2">Password</p>
          <div className="flex w-full items-stretch rounded-lg">
            <input
              className={`form-input flex w-full min-w-0 flex-1 rounded-lg rounded-r-none border-r-0 text-[#111318] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-gray-800 h-14 placeholder:text-[#616f89] p-[15px] ${fieldErrors.password ? 'ring-2 ring-red-500' : ''}`}
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="text-[#616f89] flex border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-gray-800 items-center justify-center pr-[15px] rounded-r-lg border-l-0 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </div>
          </div>
          {fieldErrors.password && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{fieldErrors.password[0]}</p>}
        </div>

        <div className="flex justify-end pt-1">
          <a className="text-primary text-sm font-semibold hover:underline" href="#">Forgot password?</a>
        </div>

        <div className="pt-6 space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center rounded-xl h-14 px-5 bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login as Super Admin'}
          </button>
        </div>
      </form>

      <div className="mt-auto mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-background-light dark:bg-gray-800/50 px-4 py-2 rounded-full">
          <span className="material-symbols-outlined text-sm text-[#616f89]">visibility</span>
          <span className="text-[#616f89] dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Secure Read-Only Access</span>
        </div>
        <div className="mt-6">
          <p className="text-[#616f89] dark:text-gray-500 text-xs">
            © 2024 RetailCore Systems. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;