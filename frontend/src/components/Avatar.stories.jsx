import Avatar from './Avatar';
import { gerard } from '../stories/fixtures';

export default {
  title: 'Composants/Avatar',
  component: Avatar,
  args: { user: gerard, size: 40 },
};

export const Initiales = {};

export const Photo = {
  args: { user: { ...gerard, avatar: 'https://picsum.photos/id/64/80' } },
};

export const Grand = { args: { size: 96 } };
