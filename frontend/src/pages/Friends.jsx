import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Avatar from '../components/Avatar';

function UserItem({ user, children }) {
  return (
    <div className="user-item">
      <Avatar user={user} />
      <Link to={`/profile/${user.id}`} className="author">
        {user.firstName} {user.lastName}
      </Link>
      <div className="user-actions">{children}</div>
    </div>
  );
}

export default function Friends() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  function loadData() {
    api('/friends/requests').then((data) => setRequests(data.requests));
    api('/friends').then((data) => setFriends(data.friends));
  }

  useEffect(loadData, []);

  async function handleSearch(e) {
    e.preventDefault();
    const data = await api(`/users?search=${encodeURIComponent(search)}`);
    setResults(data.users);
  }

  async function acceptRequest(id) {
    await api(`/friends/requests/${id}`, { method: 'PUT' });
    loadData();
  }

  async function refuseRequest(id) {
    await api(`/friends/requests/${id}`, { method: 'DELETE' });
    loadData();
  }

  return (
    <>
      <div className="card">
        <h3>Rechercher</h3>
        <form className="row" onSubmit={handleSearch}>
          <input placeholder="Nom d'une personne" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="submit">Rechercher</button>
        </form>
        {results.map((u) => (
          <UserItem key={u.id} user={u} />
        ))}
      </div>

      <div className="card">
        <h3>Demandes reçues ({requests.length})</h3>
        {requests.length === 0 && <p>Aucune demande.</p>}
        {requests.map((r) => (
          <UserItem key={r.id} user={r.from}>
            <button onClick={() => acceptRequest(r.id)}>Accepter</button>
            <button className="btn-light" onClick={() => refuseRequest(r.id)}>
              Refuser
            </button>
          </UserItem>
        ))}
      </div>

      <div className="card">
        <h3>Mes amis ({friends.length})</h3>
        {friends.length === 0 && <p>Vous n'avez pas encore d'amis.</p>}
        {friends.map((f) => (
          <UserItem key={f.id} user={f} />
        ))}
      </div>
    </>
  );
}
