import PostForm from './PostForm';
import { gerard } from '../stories/fixtures';

export default {
  title: 'Composants/PostForm',
  component: PostForm,
  args: { user: gerard, onCreated: () => {} },
};

export const Vide = {};
