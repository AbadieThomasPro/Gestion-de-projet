import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../api';
import Avatar from './Avatar';

function Badge({ count }) {
  if (!count) return null;
  return <span className="badge-red">{count}</span>;
}

export default function Navbar({ user, onLogout }) {
  const location = useLocation();
  const [counts, setCounts] = useState({ notifications: 0, friendRequests: 0 });

  useEffect(() => {
    function loadCounts() {
      api('/notifications/count')
        .then(setCounts)
        .catch(() => {});
    }

    loadCounts();
    const interval = setInterval(loadCounts, 5000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  // No badge on the notifications page, they are being read
  const notifCount = location.pathname === '/notifications' ? 0 : counts.notifications;

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        facebook-like
      </Link>
      <div className="nav-links">
        <Link to="/">Accueil</Link>
        <Link to="/friends">
          Amis <Badge count={counts.friendRequests} />
        </Link>
        <Link to="/notifications">
          Notifications <Badge count={notifCount} />
        </Link>
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
