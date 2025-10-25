import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { t } = useLocalization();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      onLoginSuccess();
    } else {
      setError(t('login.error'));
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-secondary p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">{t('login.title')}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-light mb-2">
              {t('login.username')}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full py-3 px-4 bg-accent text-highlight rounded-lg focus:outline-none focus:ring-4 focus:ring-brand/50 transition-all duration-300"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-light mb-2">
              {t('login.password')}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full py-3 px-4 bg-accent text-highlight rounded-lg focus:outline-none focus:ring-4 focus:ring-brand/50 transition-all duration-300"
            />
          </div>
          {error && <p className="text-red-400 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full bg-brand text-primary font-bold py-3 px-8 rounded-lg hover:bg-sky-400 transition-colors duration-300"
            >
              {t('login.loginButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
