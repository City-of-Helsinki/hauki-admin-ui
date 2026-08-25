import { act } from 'react';
import toast from './Toast';

describe(`toast`, () => {
  vi.useFakeTimers();

  it('should render success toast in the dom', async () => {
    const props = {
      dataTestId: 'test-success-notification',
      label: 'test-success-notification-label',
      text: 'test-success-notification-text',
    };

    act(() => {
      toast.success(props);
    });

    const successToast = document.body.querySelector(
      `[data-testId="${props.dataTestId}"]`
    );

    expect(successToast).toHaveTextContent(props.label);
    expect(successToast).toHaveTextContent(props.text);
  });

  it('removes the toast from the dom after it is closed', async () => {
    const props = {
      dataTestId: 'test-error-notification',
      dismissible: true,
      label: 'test-error-notification-label',
    };
    const selector = `[data-testId="${props.dataTestId}"]`;

    act(() => {
      toast.error(props);
    });

    const closeButton = document.body
      .querySelector(selector)
      ?.querySelector('button');

    expect(closeButton).toBeTruthy();

    act(() => {
      closeButton?.click();
    });

    // Two delays stack here: HDS runs its own close animation before it calls
    // onClose, and removeContainer then detaches the node a second later.
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(document.body.querySelector(selector)).toBeNull();
  });
});
