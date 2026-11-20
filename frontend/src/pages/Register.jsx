import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import ZoneSelect from '../components/ZoneSelect';

export default function Register({ onLogin }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', zoneId: null });
  const [zones, setZones] = useState([]);
  const [zonesLoading, setZonesLoading] = useState(true);
  const [zonesError, setZonesError] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api('/zones')
      .then((data) => setZones(data.zones))
      .catch(() => setZonesError('Impossible de charger les quartiers. Réessayez dans un instant.'))
      .finally(() => setZonesLoading(false));
  }, []);

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
      <h1 className="logo">LocalLoop</h1>
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
        <ZoneSelect
          zones={zones}
          value={form.zoneId}
          onChange={(zoneId) => setForm({ ...form, zoneId })}
          isLoading={zonesLoading}
          error={zonesError}
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
