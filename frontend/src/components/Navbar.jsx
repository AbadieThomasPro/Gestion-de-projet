import { Link } from 'react-router-dom';
import Avatar from './Avatar';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        LocalLoop
      </Link>
      <div className="nav-links">
        <Link to="/">Accueil</Link>
        <Link to={`/profile/${user.id}`} className="nav-user">
          <Avatar user={user} size={28} />
          {user.firstName}
        </Link>
        <button className="btn-light" onClick={onLogout}>
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
