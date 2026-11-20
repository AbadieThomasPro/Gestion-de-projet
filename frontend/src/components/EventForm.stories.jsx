import EventForm from './EventForm';
import { gerard } from '../stories/fixtures';

export default {
  title: 'Composants/EventForm',
  component: EventForm,
  args: { user: gerard, onCreated: () => {} },
};

export const Vide = {};

export const SansQuartier = {
  name: 'Compte sans quartier',
  args: { user: { ...gerard, zoneId: null, zone: null } },
};
