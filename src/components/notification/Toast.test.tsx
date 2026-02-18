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
});
