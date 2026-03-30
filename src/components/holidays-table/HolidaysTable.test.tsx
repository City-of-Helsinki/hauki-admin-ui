import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HolidaysTable from './HolidaysTable';
import { Holiday } from '../../services/holidays';
import { useAppContext } from '../../App-context';
import { Language } from '../../common/lib/types';

import { SelectedDatePeriodsProvider } from '../../common/selectedDatePeriodsContext/SelectedDatePeriodsContext';

// Mock useTranslation hook
vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
         
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
     
    init: () => {},
  },
}));

// Mock useAppContext hook
vi.mock('../../App-context', () => ({
  useAppContext: vi.fn(),
}));

const mockHolidays: Holiday[] = [
  {
    date: '2023-12-25',
    name: {
      fi: 'Joulupäivä',
      sv: 'Juldagen',
      en: 'Christmas Day',
    },
  },
  {
    date: '2023-01-06',
    name: {
      en: 'Epiphany',
      fi: 'Loppiainen',
      sv: 'Trettondedag jul',
    },
  },
];

const renderWithLanguage = (language: Language) => {
  vi.mocked(useAppContext).mockReturnValue({ language });
  render(
    <MemoryRouter>
      <SelectedDatePeriodsProvider>
        <HolidaysTable
          datePeriodConfig={undefined}
          datePeriods={[]}
          holidays={mockHolidays}
          initiallyOpen
        />
      </SelectedDatePeriodsProvider>
    </MemoryRouter>
  );
};

describe('HolidaysTable', () => {
  test('renders HolidaysTable component in Finnish', () => {
    renderWithLanguage(Language.FI);
    expect(screen.getAllByText('Joulupäivä')[0]).toBeInTheDocument();
  });

  test('renders HolidaysTable component in Swedish', () => {
    renderWithLanguage(Language.SV);
    expect(screen.getAllByText('Juldagen')[0]).toBeInTheDocument();
  });

  test('renders HolidaysTable component in English', () => {
    renderWithLanguage(Language.EN);
    expect(screen.getAllByText('Christmas Day')[0]).toBeInTheDocument();
  });
});
