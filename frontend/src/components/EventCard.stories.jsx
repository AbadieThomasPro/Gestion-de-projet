import EventCard from './EventCard';
import { event } from '../stories/fixtures';

export default {
  title: 'Composants/EventCard',
  component: EventCard,
  args: { event },
};

export const EvenementDuQuartier = { name: 'Événement du quartier' };

export const TexteLong = {
  args: {
    event: {
      ...event,
      title: 'Grand nettoyage de printemps des berges de la Garonne avec l’association du quartier',
      place: 'Devant la médiathèque, à côté de l’arrêt de bus Saint-Michel – Marcel Langer',
      description:
        'Gants et sacs fournis. Prévoyez de bonnes chaussures, nous longerons la berge sur deux kilomètres. '.repeat(3),
    },
  },
};
