import { useEffect, useState } from 'react';
import { api } from '../api';
import EventCard from '../components/EventCard';
import EventForm from '../components/EventForm';

// Upcoming events of the neighbourhood, from the nearest date
export default function Events({ user }) {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/events?page=${page}`)
      .then((data) => {
        setEvents((prev) => (page === 1 ? data.events : [...prev, ...data.events]));
        setHasMore(data.hasMore);
      })
      .catch((err) => setError(err.message));
  }, [page]);

  // The new event takes its place in the date order
  function handleCreated(event) {
    setEvents((prev) => [...prev, event].sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt)));
  }

  return (
    <>
      <EventForm user={user} onCreated={handleCreated} />

      <h2>Événements à venir</h2>
      {error && <p className="error">{error}</p>}
      {!error && events.length === 0 && <p className="center">Aucun événement prévu dans votre quartier.</p>}

      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}

      {hasMore && (
        <button className="btn-light load-more" onClick={() => setPage(page + 1)}>
          Voir plus
        </button>
      )}
    </>
  );
}
