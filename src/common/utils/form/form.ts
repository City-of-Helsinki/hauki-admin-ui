import { Choice, InputOption, Language } from '../../lib/types';

/* eslint-disable import/prefer-default-export */
export const choiceToOption = (language: Language) => <T = string>(
  choice: Choice<T>
): InputOption<T> => ({
  value: choice.value,
  label: choice.label[language] ?? '',
});

/**
 * Sanitizes the id to a meaningful id by replacing []. with dash (-)
 *
 * @example
 * // returns openingHours-0-timeSpanGroups-0-timeSpans-0-start-time
 * sanitizeId(openingHours[0].timeSpanGroups[0].timeSpans[0]-start-time);
 *
 */
export const sanitizeId = (id: string): string =>
  id.replace(/\]/g, '').replace(/\[|\./g, '-');
