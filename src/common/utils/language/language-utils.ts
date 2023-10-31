import { Language, LanguageOption } from '../../lib/types';

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
