import { MemoryRouter } from 'react-router-dom';
import '../src/index.css';

// Gérard's screen (persona) is the default viewport: every component must be readable in 800x600
const viewports = {
  gerard: { name: 'Gérard 800×600', styles: { width: '800px', height: '600px' }, type: 'desktop' },
  mobile: { name: 'Mobile 375×667', styles: { width: '375px', height: '667px' }, type: 'mobile' },
  desktop: { name: 'Bureau 1280×800', styles: { width: '1280px', height: '800px' }, type: 'desktop' },
};

/** @type {import('@storybook/react').Preview} */
export default {
  parameters: {
    viewport: { viewports, defaultViewport: 'gerard' },
    layout: 'padded',
    controls: { matchers: { date: /At$/ } },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="container">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};
