// eslint-disable-next-line import/prefer-default-export
import { act } from 'react';
import { fireEvent } from '@testing-library/react';

export function getElementOrThrow(
  container: Element | null,
  selector: string
): Element {
  if (container === null) {
    throw new Error('container was null');
  }
  const element = container.querySelector(selector);

  if (!element) {
    throw new Error(`Element with selector ${selector} not found`);
  }

  return element;
}

export async function selectOption({
  container,
  id,
  value,
}: {
  container: Element;
  id: string;
  value: string;
}): Promise<void> {
  await act(async () => {
    const selectButtonSelector = `${id}-toggle-button`;
    const selectButton = getElementOrThrow(container, selectButtonSelector);

    fireEvent.click(selectButton);
  });

  await act(async () => {
    const selectDropDownSelector = `${id}-menu`;
    const selectMenu = getElementOrThrow(container, selectDropDownSelector);

    const [optionToSelect] = Array.from(
      selectMenu?.querySelectorAll('li') ?? []
    ).filter(
      (el) =>
        el.textContent && el.textContent?.toLowerCase() === value.toLowerCase()
    );

    if (!optionToSelect) {
      throw new Error(`${value} option not found`);
    }

    fireEvent.click(optionToSelect);
  });
}
