import { Language } from '../../lib/types';

const displayLangVersionNotFound = ({
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

export default displayLangVersionNotFound;
