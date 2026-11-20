import Post from './Post';
import { chloe, gerard, post } from '../stories/fixtures';

export default {
  title: 'Composants/Post',
  component: Post,
  args: { post, user: chloe, onDeleted: () => {} },
};

export const PublicationDUnVoisin = { name: 'Publication d’un voisin' };

export const MaPublication = {
  name: 'Ma publication (bouton Supprimer)',
  args: { user: gerard },
};

export const DejaAimee = {
  name: 'Déjà aimée',
  args: { post: { ...post, likedByMe: true, likesCount: 4 } },
};

export const TexteLong = {
  args: {
    post: {
      ...post,
      content:
        'Bonjour à tous, la réunion du conseil de quartier est déplacée au jeudi 18h à la salle des fêtes. ' +
        'Ordre du jour : propreté de la place, nouveaux bancs, fête des voisins. Venez nombreux, ' +
        'les enfants sont les bienvenus et il y aura un goûter offert par l’association. '.repeat(2),
    },
  },
};
