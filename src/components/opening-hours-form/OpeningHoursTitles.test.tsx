import { render, screen } from '@testing-library/react';
import OpeningHoursTitles from './OpeningHoursTitles';

// Mock useTranslation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const fieldState = vi.hoisted(() => ({
  error: null as { message: string } | null,
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
      fieldState: { error: fieldState.error },
    }),
}));

const titleLabels = [
  'OpeningHours.TitleInFinnish',
  'OpeningHours.TitleInSwedish',
  'OpeningHours.TitleInEnglish',
];

const noPlaceholders = { fi: null, sv: null, en: null };

afterEach(() => {
  fieldState.error = null;
});

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

test.each(titleLabels)(
  '%s is described by its character count and the shared helper text',
  (label) => {
    render(<OpeningHoursTitles placeholders={noPlaceholders} />);

    const input = screen.getByLabelText(label);
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).toHaveAccessibleDescription(
      '0/100 OpeningHours.TitlesHelperText'
    );
  }
);

test.each(titleLabels)(
  '%s exposes its validation error to assistive technology',
  (label) => {
    fieldState.error = { message: 'OpeningHours.Validate' };
    render(<OpeningHoursTitles placeholders={noPlaceholders} />);

    const input = screen.getByLabelText(label);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(
      '0/100 OpeningHours.Validate OpeningHours.TitlesHelperText'
    );
  }
);
