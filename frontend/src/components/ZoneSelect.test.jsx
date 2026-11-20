import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ZoneSelect from './ZoneSelect';
import { zones } from '../stories/fixtures';

describe('ZoneSelect', () => {
  it('lists the zones and returns the chosen id as a number', async () => {
    const onChange = vi.fn();
    render(<ZoneSelect zones={zones} value={null} onChange={onChange} />);

    await userEvent.selectOptions(screen.getByLabelText('Mon quartier'), 'Les Carmes (Toulouse)');

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('is disabled with a readable message when the zones cannot be loaded', () => {
    render(<ZoneSelect zones={[]} value={null} onChange={() => {}} error="Impossible de charger les quartiers." />);

    expect(screen.getByLabelText('Mon quartier')).toBeDisabled();
    expect(screen.getByText('Impossible de charger les quartiers.')).toBeInTheDocument();
  });
});
