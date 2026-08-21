import { fireEvent, render, screen } from '@testing-library/react';
import OpeningHoursFormPreviewMobile from './OpeningHoursFormPreviewMobile';
import {
  DatePeriod,
  Language,
  ResourceState,
  TranslatedApiChoice,
} from '../../common/lib/types';

// Mock useTranslation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const datePeriod: DatePeriod = {
  endDate: '10.01.2024',
  fixed: true,
  name: { fi: 'Poikkeus', sv: null, en: null },
  openingHours: [],
  override: false,
  startDate: '01.01.2024',
};

const resourceStates: TranslatedApiChoice[] = [
  {
    value: ResourceState.OPEN,
    label: { fi: 'Auki', sv: null, en: null },
  },
];

const renderPreview = () => {
  const { container } = render(
    <OpeningHoursFormPreviewMobile
      datePeriod={datePeriod}
      language={Language.FI}
      resourceStates={resourceStates}
    />
  );

  return {
    toggle: screen.getByRole('button', {
      name: 'OpeningHours.OpeningHoursFormPreview',
    }),
    panel: container.querySelector('.opening-hours-preview-mobile'),
  };
};

describe('OpeningHoursFormPreviewMobile', () => {
  it('renders the preview collapsed behind a toggle', () => {
    const { toggle, panel } = renderPreview();

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(panel).toHaveAttribute('aria-hidden', 'true');
    expect(panel).toHaveClass('opening-hours-preview-mobile--closed');
  });

  it('renders the preview content itself', () => {
    renderPreview();

    // Collapsed content is aria-hidden, so it is outside the accessibility tree
    expect(
      screen.getByRole('heading', {
        name: 'OpeningHours.OpeningHoursFormPreview',
        hidden: true,
      })
    ).toBeInTheDocument();
  });

  it('opens the preview when the toggle is pressed', () => {
    const { toggle, panel } = renderPreview();

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(panel).toHaveAttribute('aria-hidden', 'false');
    expect(panel).toHaveClass('opening-hours-preview-mobile--open');
  });

  it('closes the preview when clicking outside of it', () => {
    const { toggle, panel } = renderPreview();

    fireEvent.click(toggle);
    expect(panel).toHaveAttribute('aria-hidden', 'false');

    fireEvent.mouseDown(document.body);

    expect(panel).toHaveAttribute('aria-hidden', 'true');
    expect(panel).toHaveClass('opening-hours-preview-mobile--closed');
  });

  it('keeps the preview open when clicking inside it', () => {
    const { toggle, panel } = renderPreview();

    fireEvent.click(toggle);
    fireEvent.mouseDown(
      screen.getByRole('heading', {
        name: 'OpeningHours.OpeningHoursFormPreview',
      })
    );

    expect(panel).toHaveAttribute('aria-hidden', 'false');
  });
});
