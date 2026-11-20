import { Link } from 'react-router-dom';
import Avatar from './Avatar';

function formatDate(date) {
  return new Date(date).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' });
}

// One event of the neighbourhood: date and place first, they are what a neighbour looks for
export default function EventCard({ event }) {
  return (
    <article className="card event-card">
      <h3>{event.title}</h3>
      <p className="event-when">📅 {formatDate(event.startsAt)}</p>
      <p className="event-where">📍 {event.place}</p>
      <p className="post-content">{event.description}</p>
      <div className="post-header event-author">
        <Avatar user={event.author} size={28} />
        <span>
          Proposé par{' '}
          <Link to={`/profile/${event.author?.id}`} className="author">
            {event.author?.firstName} {event.author?.lastName}
          </Link>
          {event.zone && ` · ${event.zone.name}`}
        </span>
      </div>
    </article>
  );
}
