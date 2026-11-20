import { useState } from 'react';
import ZoneSelect from './ZoneSelect';
import { zones } from '../stories/fixtures';

export default {
  title: 'Composants/ZoneSelect',
  component: ZoneSelect,
  args: { zones },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? null);
    return <ZoneSelect {...args} value={value} onChange={setValue} />;
  },
};

export const AChoisir = { name: 'À choisir' };

export const Choisi = { args: { value: zones[0].id } };

export const Chargement = { args: { zones: [], isLoading: true } };

export const Erreur = {
  args: { zones: [], error: 'Impossible de charger les quartiers. Réessayez dans un instant.' },
};
