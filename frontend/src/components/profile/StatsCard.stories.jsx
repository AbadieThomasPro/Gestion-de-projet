import StatsCard from './StatsCard';

export default {
  title: 'Profil/StatsCard',
  component: StatsCard,
  args: { stats: { posts: 12, likesReceived: 48, commentsReceived: 9, currentStreak: 3 }, isMe: false },
};

export const AvecActivite = { name: 'Avec activité' };

export const UnJourDeSerie = {
  name: 'Série d’un jour',
  args: { stats: { posts: 1, likesReceived: 0, commentsReceived: 0, currentStreak: 1 } },
};

export const MonProfilVide = {
  name: 'Mon profil sans publication',
  args: { stats: { posts: 0, likesReceived: 0, commentsReceived: 0, currentStreak: 0 }, isMe: true },
};

export const Chargement = { args: { stats: null, isLoading: true } };

export const Erreur = { args: { stats: null, error: new Error('LL_INTERNAL_500') } };
