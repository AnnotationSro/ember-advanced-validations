import en from "../locales/en/translations";

/**
 * initialize default validation message translations
 */
export function initialize(applicationInstance ) {
  const i18n = applicationInstance.lookup('service:i18n');
  i18n.addTranslations("en", en);
}

export default {
  name: 'translations',
  initialize
};
