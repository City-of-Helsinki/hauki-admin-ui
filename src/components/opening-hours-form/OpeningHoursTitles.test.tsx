import React from 'react';
import { render, screen } from '@testing-library/react';
import OpeningHoursTitles from './OpeningHoursTitles';

// Mock useTranslation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Controller component
vi.mock('react-hook-form', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
  Controller: ({ render: renderMock }: any) =>
    renderMock({
      field: {
        ref: vi.fn(),
        name: '',
        onChange: vi.fn(),
        onBlur: vi.fn(),
        value: '',
      },
      fieldState: { error: null },
    }),
}));

test('renders OpeningHoursTitles component', () => {
  const placeholders = {
    fi: 'Placeholder FI',
    sv: 'Placeholder SV',
    en: 'Placeholder EN',
  };
  render(<OpeningHoursTitles placeholders={placeholders} />);

  // Assertions for labels
  expect(
    screen.getByLabelText('OpeningHours.TitleInFinnish')
  ).toBeInTheDocument();
  expect(
    screen.getByLabelText('OpeningHours.TitleInSwedish')
  ).toBeInTheDocument();
  expect(
    screen.getByLabelText('OpeningHours.TitleInEnglish')
  ).toBeInTheDocument();

  // Assertions for placeholders
  expect(screen.getByTestId('opening-period-title-fi')).toHaveAttribute(
    'placeholder',
    placeholders.fi
  );
  expect(screen.getByTestId('opening-period-title-sv')).toHaveAttribute(
    'placeholder',
    placeholders.sv
  );
  expect(screen.getByTestId('opening-period-title-en')).toHaveAttribute(
    'placeholder',
    placeholders.en
  );
});
