import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PrimaryButton, SecondaryButton, SupplementaryButton } from './Button';

type ButtonComponent = React.ComponentType<{
  children: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  dataTest?: string;
}>;

const testCommonButtonBehavior = (
  component: ButtonComponent,
  label: string
) => {
  const Component = component;
  it('renders children text', () => {
    render(<Component>{label}</Component>);
    expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Component onClick={handleClick}>{label}</Component>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Component disabled>{label}</Component>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled and shows loadingText when isLoading is true', () => {
    render(
      <Component isLoading loadingText="Loading...">
        {label}
      </Component>
    );
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows children text when isLoading but no loadingText', () => {
    render(<Component isLoading>{label}</Component>);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('sets data-testid when dataTest is provided', () => {
    render(<Component dataTest="test-btn">{label}</Component>);
    expect(screen.getByTestId('test-btn')).toBeInTheDocument();
  });
};

describe('<PrimaryButton />', () => {
  testCommonButtonBehavior(PrimaryButton, 'Click me');

  it('applies custom className', () => {
    render(<PrimaryButton className="my-class">Click me</PrimaryButton>);
    expect(screen.getByRole('button')).toHaveClass('my-class');
  });

  it('has type="button" by default', () => {
    render(<PrimaryButton>Click me</PrimaryButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('respects custom type prop', () => {
    render(<PrimaryButton type="submit">Click me</PrimaryButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('sets aria-expanded when provided', () => {
    render(<PrimaryButton aria-expanded={false}>Click me</PrimaryButton>);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });
});

describe('<SecondaryButton />', () => {
  testCommonButtonBehavior(SecondaryButton, 'Cancel');
});

describe('<SupplementaryButton />', () => {
  testCommonButtonBehavior(SupplementaryButton, 'More');
});
