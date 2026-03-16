import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PrimaryButton, SecondaryButton, SupplementaryButton } from './Button';

describe('<PrimaryButton />', () => {
  it('renders children text', () => {
    render(<PrimaryButton>Click me</PrimaryButton>);
    expect(
      screen.getByRole('button', { name: 'Click me' })
    ).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<PrimaryButton onClick={handleClick}>Click me</PrimaryButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<PrimaryButton disabled>Click me</PrimaryButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled and shows loadingText when isLoading is true', () => {
    render(
      <PrimaryButton isLoading loadingText="Loading...">
        Click me
      </PrimaryButton>
    );
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows children text when isLoading but no loadingText', () => {
    render(<PrimaryButton isLoading>Click me</PrimaryButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('sets data-testid when dataTest is provided', () => {
    render(<PrimaryButton dataTest="my-btn">Click me</PrimaryButton>);
    expect(screen.getByTestId('my-btn')).toBeInTheDocument();
  });

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
  it('renders children text', () => {
    render(<SecondaryButton>Cancel</SecondaryButton>);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<SecondaryButton onClick={handleClick}>Cancel</SecondaryButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<SecondaryButton disabled>Cancel</SecondaryButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled and shows loadingText when isLoading is true', () => {
    render(
      <SecondaryButton isLoading loadingText="Please wait">
        Cancel
      </SecondaryButton>
    );
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });

  it('sets data-testid when dataTest is provided', () => {
    render(<SecondaryButton dataTest="secondary-btn">Cancel</SecondaryButton>);
    expect(screen.getByTestId('secondary-btn')).toBeInTheDocument();
  });
});

describe('<SupplementaryButton />', () => {
  it('renders children text', () => {
    render(<SupplementaryButton>More</SupplementaryButton>);
    expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(
      <SupplementaryButton onClick={handleClick}>More</SupplementaryButton>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<SupplementaryButton disabled>More</SupplementaryButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled and shows loadingText when isLoading is true', () => {
    render(
      <SupplementaryButton isLoading loadingText="Working...">
        More
      </SupplementaryButton>
    );
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Working...')).toBeInTheDocument();
  });

  it('sets data-testid when dataTest is provided', () => {
    render(
      <SupplementaryButton dataTest="supplementary-btn">
        More
      </SupplementaryButton>
    );
    expect(screen.getByTestId('supplementary-btn')).toBeInTheDocument();
  });
});
