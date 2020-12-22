import React from 'react';
import { Navigation } from 'hds-react';
import { Language, LanguageOption } from '../../common/lib/types';
import './LanguageSelect.scss';

export const languageOptions: LanguageOption[] = [
  { label: 'Suomeksi', value: Language.FI },
  { label: 'Svenska', value: Language.SV },
  { label: 'English', value: Language.EN },
];

export const displayLangVersionNotFound = ({
  language,
  label,
}: {
  language: Language;
  label: string;
}): string => {
  const texts = {
    [Language.FI]: `Suomenkielinen ${label} puuttuu.`,
    [Language.SV]: `Ruotsinkielinen ${label} puuttuu.`,
    [Language.EN]: `Englanninkielinen ${label} puuttuu.`,
  };
  return texts[language];
};

const formatSelectedLanguage = (selectedLanguage: Language): string =>
  selectedLanguage.toUpperCase();

export default function LanguageSelect({
  id,
  label,
  className,
  selectedLanguage,
  onSelect,
  formatter = formatSelectedLanguage,
  theme,
}: {
  id: string;
  label: string;
  className?: string;
  selectedLanguage: Language;
  onSelect: (language: Language) => void;
  formatter?: (selectedLanguage: Language) => string;
  theme?: 'dark';
}): JSX.Element {
  const componentClassName = `custom-language-select${
    theme ? ` custom-language-select--${theme}` : ''
  }${className ? ` ${className}` : ''}`;

  return (
    <Navigation.LanguageSelector
      id={id}
      buttonAriaLabel={label}
      className={componentClassName}
      label={formatter(selectedLanguage)}>
      {languageOptions.map((languageOption) => (
        <Navigation.Item
          as="a"
          href="#"
          key={languageOption.value}
          label={languageOption.label}
          onClick={(
            e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
          ): void => {
            e.preventDefault();
            onSelect(languageOption.value);
          }}
        />
      ))}
    </Navigation.LanguageSelector>
  );
}
