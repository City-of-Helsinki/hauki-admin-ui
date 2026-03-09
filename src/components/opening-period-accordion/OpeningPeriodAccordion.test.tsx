import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import { SelectedDatePeriodsProvider } from '../../common/selectedDatePeriodsContext/SelectedDatePeriodsContext';
import OpeningPeriodAccordion from './OpeningPeriodAccordion';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    init: () => {},
  },
}));

// Default to desktop — avoids useMobile's useEffect reading window.innerWidth = 0 in jsdom
vi.mock('../../hooks/useMobile', () => ({ default: () => false }));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useParams: () => ({ id: '123', parentId: undefined }),
    useNavigate: () => vi.fn(),
  };
});

const renderAccordion = (
  props: Partial<React.ComponentProps<typeof OpeningPeriodAccordion>> = {}
) =>
  render(
    <Router>
      <SelectedDatePeriodsProvider>
        <OpeningPeriodAccordion
          dateRange={<span>1 Jan – 31 Dec</span>}
          {...props}>
          <div>Period content</div>
        </OpeningPeriodAccordion>
      </SelectedDatePeriodsProvider>
    </Router>
  );

describe('OpeningPeriodAccordion', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('accordion toggle label', () => {
    it('shows ShowPeriod key when closed with a named period', () => {
      renderAccordion({ periodName: 'Summer hours' });

      expect(
        screen.getByText('ResourcePage.OpeningPeriodsSection.ShowPeriod')
      ).toBeInTheDocument();
    });

    it('shows HidePeriod key after opening a named period', async () => {
      const user = userEvent.setup();
      renderAccordion({ periodName: 'Summer hours' });

      await user.click(screen.getByTestId('openingPeriodAccordionButton'));

      expect(
        screen.getByText('ResourcePage.OpeningPeriodsSection.HidePeriod')
      ).toBeInTheDocument();
    });

    it('shows ShowUntitledPeriod key when closed without a period name', () => {
      renderAccordion({ periodName: null });

      expect(
        screen.getByText(
          'ResourcePage.OpeningPeriodsSection.ShowUntitledPeriod'
        )
      ).toBeInTheDocument();
    });

    it('shows HideUntitledPeriod key after opening a period without a name', async () => {
      const user = userEvent.setup();
      renderAccordion({ periodName: null });

      await user.click(screen.getByTestId('openingPeriodAccordionButton'));

      expect(
        screen.getByText(
          'ResourcePage.OpeningPeriodsSection.HideUntitledPeriod'
        )
      ).toBeInTheDocument();
    });
  });

  describe('move buttons', () => {
    it('enables move up button when onMoveUp is provided', () => {
      renderAccordion({
        onMoveUp: vi.fn(),
        onMoveDown: vi.fn(),
      });

      expect(
        screen.getByTestId('openingPeriodMoveUpButton')
      ).not.toBeDisabled();
    });

    it('disables move up button when onMoveUp is not provided', () => {
      renderAccordion({ onMoveDown: vi.fn() });

      expect(screen.getByTestId('openingPeriodMoveUpButton')).toBeDisabled();
    });

    it('disables move down button when onMoveDown is not provided', () => {
      renderAccordion({ onMoveUp: vi.fn() });

      expect(screen.getByTestId('openingPeriodMoveDownButton')).toBeDisabled();
    });

    it('uses MoveUpPeriod key for visually-hidden label with a named period', () => {
      renderAccordion({
        onMoveUp: vi.fn(),
        periodName: 'Summer hours',
      });

      expect(
        screen.getByText('ResourcePage.OpeningPeriodsSection.MoveUpPeriod')
      ).toBeInTheDocument();
    });

    it('uses MoveUpUntitledPeriod key for visually-hidden label without a period name', () => {
      renderAccordion({ onMoveUp: vi.fn(), periodName: null });

      expect(
        screen.getByText(
          'ResourcePage.OpeningPeriodsSection.MoveUpUntitledPeriod'
        )
      ).toBeInTheDocument();
    });

    it('uses MoveDownPeriod key for visually-hidden label with a named period', () => {
      renderAccordion({
        onMoveDown: vi.fn(),
        periodName: 'Summer hours',
      });

      expect(
        screen.getByText('ResourcePage.OpeningPeriodsSection.MoveDownPeriod')
      ).toBeInTheDocument();
    });

    it('calls onMoveUp when the move up button is clicked', async () => {
      const user = userEvent.setup();
      const onMoveUp = vi.fn();
      renderAccordion({ onMoveUp, onMoveDown: vi.fn() });

      await user.click(screen.getByTestId('openingPeriodMoveUpButton'));

      expect(onMoveUp).toHaveBeenCalledTimes(1);
    });

    it('calls onMoveDown when the move down button is clicked', async () => {
      const user = userEvent.setup();
      const onMoveDown = vi.fn();
      renderAccordion({ onMoveUp: vi.fn(), onMoveDown });

      await user.click(screen.getByTestId('openingPeriodMoveDownButton'));

      expect(onMoveDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('listIndex', () => {
    it('renders the list index when provided', () => {
      renderAccordion({ onMoveUp: vi.fn(), listIndex: 3 });

      expect(screen.getByText('3.')).toBeInTheDocument();
    });

    it('does not render a list index when not provided', () => {
      renderAccordion({ onMoveUp: vi.fn() });

      expect(screen.queryByText(/\d+\./)).not.toBeInTheDocument();
    });
  });

  describe('delete confirmation modal', () => {
    it('opens the confirmation modal when the delete button is clicked', async () => {
      const user = userEvent.setup();
      renderAccordion({ onDelete: vi.fn() });

      await user.click(screen.getByTestId('openingPeriodDeleteLink'));

      // Modal confirm button becomes visible
      expect(
        screen.getByText('ResourcePage.OpeningPeriodsSection.Remove')
      ).toBeInTheDocument();
    });

    it('calls onDelete when the modal confirm button is clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      renderAccordion({ onDelete });

      await user.click(screen.getByTestId('openingPeriodDeleteLink'));
      await user.click(
        screen.getByText('ResourcePage.OpeningPeriodsSection.Remove')
      );

      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('does not call onDelete when the modal cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      renderAccordion({ onDelete });

      await user.click(screen.getByTestId('openingPeriodDeleteLink'));
      await user.click(screen.getByText('Common.Cancel'));

      expect(onDelete).not.toHaveBeenCalled();
    });
  });
});
