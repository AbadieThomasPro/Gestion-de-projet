import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import Avatar from '../components/Avatar';
import Post from '../components/Post';
import StatsCard from '../components/profile/StatsCard';

export default function Profile({ user, setUser }) {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friendStatus, setFriendStatus] = useState('none');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // Statistics are loaded apart: an error here must not hide the profile
  useEffect(() => {
    let ignore = false;
    setStats(null);
    setStatsError(null);
    setStatsLoading(true);

    api(`/users/${id}/stats`)
      .then((data) => !ignore && setStats(data))
      .catch((err) => !ignore && setStatsError(err))
      .finally(() => !ignore && setStatsLoading(false));

    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    setEditing(false);
    api(`/users/${id}`)
      .then((data) => {
        setProfile(data.user);
        setPosts(data.posts);
        setFriendStatus(data.friendStatus);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  function startEditing() {
    setForm({
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio,
      avatar: profile.avatar,
    });
    setEditing(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    const data = await api('/users/me', { method: 'PUT', body: form });
    setProfile(data.user);
    setUser(data.user);
    setEditing(false);
  }

  async function addFriend() {
    await api('/friends/requests', { method: 'POST', body: { toId: profile.id } });
    setFriendStatus('sent');
  }

  if (error) return <p className="error center">{error}</p>;
  if (!profile) return <p className="center">Chargement...</p>;

  return (
    <>
      <div className="card profile-header">
        <Avatar user={profile} size={100} />
        <h2>
          {profile.firstName} {profile.lastName}
        </h2>
        {profile.zone && <p className="zone">Quartier : {profile.zone.name}</p>}
        {profile.bio && <p>{profile.bio}</p>}

        {friendStatus === 'me' && !editing && (
          <button className="btn-light" onClick={startEditing}>
            Modifier le profil
          </button>
        )}
        {friendStatus === 'none' && <button onClick={addFriend}>Ajouter en ami</button>}
        {friendStatus === 'sent' && <span className="badge">Demande envoyée</span>}
        {friendStatus === 'received' && <span className="badge">Vous a envoyé une demande</span>}
        {friendStatus === 'friends' && <span className="badge">Amis</span>}
      </div>

      <StatsCard
        stats={stats}
        isLoading={statsLoading}
        error={statsError}
        isMe={friendStatus === 'me'}
      />

      {editing && (
        <form className="card edit-form" onSubmit={handleSave}>
          <div className="row">
            <input
              placeholder="Prénom"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <input
              placeholder="Nom"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>
          <textarea
            placeholder="Bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
          <input
            placeholder="Lien de l'avatar (URL d'une image)"
            value={form.avatar}
            onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          />
          <div className="row">
            <button type="submit">Enregistrer</button>
            <button type="button" className="btn-light" onClick={() => setEditing(false)}>
              Annuler
            </button>
          </div>
        </form>
      )}

      <h3>Publications</h3>
      {posts.length === 0 && <p>Aucune publication.</p>}
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          user={user}
          onDeleted={(postId) => setPosts(posts.filter((p) => p.id !== postId))}
        />
      ))}
    </>
  );
}
