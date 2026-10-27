import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await api('/auth/login', { method: 'POST', body: { email, password } });
      onLogin(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <h1 className="logo">facebook-like</h1>
      <form className="card auth-form" onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Se connecter</button>
        <p>
          Pas de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </form>
    </div>
  );
}
