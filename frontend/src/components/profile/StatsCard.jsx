import { Link } from 'react-router-dom';

const COUNTERS = [
  { key: 'posts', label: 'Publications' },
  { key: 'likesReceived', label: 'Likes' },
  { key: 'commentsReceived', label: 'Commentaires' },
  { key: 'currentStreak', label: 'Série en cours' },
];

function formatValue(key, value) {
  if (key !== 'currentStreak') return value;
  return `${value} ${value > 1 ? 'jours' : 'jour'}`;
}

// Statistics of a profile. isMe shows the invitation to publish on our own profile only.
export default function StatsCard({ stats, isLoading, error, isMe = false }) {
  let content;

  if (isLoading) {
    content = <p>Chargement des statistiques...</p>;
  } else if (error) {
    content = <p className="error">Impossible d'afficher les statistiques pour le moment.</p>;
  } else if (stats) {
    const noActivity = COUNTERS.every(({ key }) => stats[key] === 0);

    content = (
      <>
        <dl className="stats-grid">
          {COUNTERS.map(({ key, label }) => (
            <div key={key} className="stat">
              <dt>{label}</dt>
              <dd>{formatValue(key, stats[key])}</dd>
            </div>
          ))}
        </dl>
        {noActivity && isMe && (
          <p className="stats-empty">
            Vous n'avez encore rien publié. <Link to="/">Partagez votre première publication</Link>.
          </p>
        )}
      </>
    );
  }

  return (
    <section className="card" aria-labelledby="stats-title" aria-busy={isLoading}>
      <h3 id="stats-title">Statistiques</h3>
      {content}
    </section>
  );
}
