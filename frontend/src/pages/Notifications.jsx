import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Avatar from '../components/Avatar';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api('/notifications').then((data) => {
      setNotifications(data.notifications);
      api('/notifications', { method: 'PUT' });
    });
  }, []);

  return (
    <div className="card">
      <h3>Notifications</h3>
      {notifications.length === 0 && <p>Aucune notification.</p>}

      {notifications.map((n) => (
        <div key={n.id} className={n.read ? 'notification' : 'notification unread'}>
          <Avatar user={n.from} />
          <div>
            <Link to={`/profile/${n.from?.id}`} className="author">
              {n.from?.firstName} {n.from?.lastName}
            </Link>{' '}
            {n.type === 'like' ? 'a aimé' : 'a commenté'} votre publication
            {n.postContent && <div className="date">« {n.postContent.slice(0, 60)} »</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
