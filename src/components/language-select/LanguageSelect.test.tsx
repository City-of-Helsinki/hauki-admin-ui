import React from 'react';
import { render, screen } from '@testing-library/react';
import { Language } from '../../common/lib/types';
import LanguageSelect from './LanguageSelect';

describe(`<LanguageSelect />`, () => {
  it('should show formatted selected language', () => {
    let selectedLanguage = Language.FI;

    // eslint-disable-next-line no-return-assign
    const onSelect = (language: Language): Language =>
      (selectedLanguage = language);

    const formatter = (language: Language): string =>
      `Esityskieli: ${language}`;

    render(
      <LanguageSelect
        id="test-select"
        label="test-select"
        selectedLanguage={selectedLanguage}
        onSelect={onSelect}
        formatter={formatter}
      />
    );

    expect(screen.getAllByText('Esityskieli: fi').length).toEqual(1);
  });
});
