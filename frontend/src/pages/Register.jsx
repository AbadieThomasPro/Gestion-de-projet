import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Register({ onLogin }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await api('/auth/register', { method: 'POST', body: form });
      onLogin(data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <h1 className="logo">facebook-like</h1>
      <form className="card auth-form" onSubmit={handleSubmit}>
        <div className="row">
          <input name="firstName" placeholder="Prénom" value={form.firstName} onChange={handleChange} />
          <input name="lastName" placeholder="Nom" value={form.lastName} onChange={handleChange} />
        </div>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe (6 caractères min.)"
          value={form.password}
          onChange={handleChange}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">S'inscrire</button>
        <p>
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}
