import { fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import useOnClickOutside from './useOnClickOutside';

const TestComponent = ({
  onClickOutside,
  attachRef = true,
}: {
  onClickOutside: () => void;
  attachRef?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, onClickOutside);

  return (
    <div>
      <div ref={attachRef ? ref : null} data-testid="inside">
        <span data-testid="child">child</span>
      </div>
      <div data-testid="outside">outside</div>
    </div>
  );
};

describe('useOnClickOutside', () => {
  it('calls the callback when clicking outside the element', () => {
    const onClickOutside = vi.fn();
    render(<TestComponent onClickOutside={onClickOutside} />);

    fireEvent.mouseDown(screen.getByTestId('outside'));

    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });

  it('does not call the callback when clicking the element or its children', () => {
    const onClickOutside = vi.fn();
    render(<TestComponent onClickOutside={onClickOutside} />);

    fireEvent.mouseDown(screen.getByTestId('inside'));
    fireEvent.mouseDown(screen.getByTestId('child'));

    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it('does nothing while the ref is unattached', () => {
    const onClickOutside = vi.fn();
    render(
      <TestComponent onClickOutside={onClickOutside} attachRef={false} />
    );

    fireEvent.mouseDown(screen.getByTestId('outside'));

    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it('stops listening after unmount', () => {
    const onClickOutside = vi.fn();
    const { unmount } = render(
      <TestComponent onClickOutside={onClickOutside} />
    );

    unmount();
    fireEvent.mouseDown(document.body);

    expect(onClickOutside).not.toHaveBeenCalled();
  });
});
