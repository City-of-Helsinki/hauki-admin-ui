import { Choice, InputOption, Language } from '../../lib/types';

/* eslint-disable import/prefer-default-export */
export const choiceToOption = (language: Language) => <T = string>(
  choice: Choice<T>
): InputOption<T> => ({
  value: choice.value,
  label: choice.label[language] ?? '',
});

export const nameToId = (id: string): string =>
  id.replace(/\[/g, '-').replace(/\]\./g, '-').replace(/\]/g, '');
