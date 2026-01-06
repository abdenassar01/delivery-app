import ar from './translations/ar.json';
import en from './translations/en.json';
import fr from './translations/fr.json';
import de from './translations/de.json';

export const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
  fr: {
    translation: fr,
  },
  de: {
    translation: de,
  },
};

export type Language = keyof typeof resources;
