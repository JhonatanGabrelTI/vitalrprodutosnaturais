'use client';

import { useState, type SyntheticEvent } from 'react';
import { Eye, EyeOff, LogIn, Mail } from 'lucide-react';

export function AdminLoginForm({ demoEmail }: { demoEmail: string }) {
  const [email, setEmail] = useState(demoEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error || 'Não foi possível entrar.');
        return;
      }
      window.location.assign('/admin');
    } catch {
      setError('Não foi possível entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="credential-form" onSubmit={submit}>
      <label>
        E-mail da loja
        <span>
          <Mail />
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </span>
      </label>
      <label>
        Senha
        <span>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Digite a senha"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </span>
      </label>
      {error && <output aria-live="polite">{error}</output>}
      <button className="login-button" disabled={loading}>
        <LogIn /> {loading ? 'Entrando…' : 'Entrar no painel'}
      </button>
    </form>
  );
}
