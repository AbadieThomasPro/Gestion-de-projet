import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import StatsCard from './StatsCard';

function renderCard(props) {
  return render(
    <MemoryRouter>
      <StatsCard {...props} />
    </MemoryRouter>
  );
}

const stats = { posts: 3, likesReceived: 5, commentsReceived: 2, currentStreak: 2 };

describe('StatsCard', () => {
  it('shows the counters', () => {
    renderCard({ stats });

    expect(screen.getByText('Publications').nextSibling).toHaveTextContent('3');
    expect(screen.getByText('2 jours')).toBeInTheDocument();
  });

  it('writes "jour" in the singular for a streak of 1', () => {
    renderCard({ stats: { ...stats, currentStreak: 1 } });

    expect(screen.getByText('1 jour')).toBeInTheDocument();
  });

  it('invites to publish on my own empty profile only', () => {
    const empty = { posts: 0, likesReceived: 0, commentsReceived: 0, currentStreak: 0 };

    const { unmount } = renderCard({ stats: empty, isMe: true });
    expect(screen.getByText(/Partagez votre première publication/)).toBeInTheDocument();
    unmount();

    renderCard({ stats: empty, isMe: false });
    expect(screen.queryByText(/Partagez votre première publication/)).not.toBeInTheDocument();
  });

  it('shows a neutral message on error', () => {
    renderCard({ error: new Error('500') });

    expect(screen.getByText(/Impossible d'afficher les statistiques/)).toBeInTheDocument();
  });
});
