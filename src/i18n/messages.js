/**
 * @fileoverview
 *   Interface for getting messages from our Fluent translations files.
 */

import { FluentBundle, FluentResource } from '@fluent/bundle';
import { negotiateLanguages } from '@fluent/langneg';

/**
 * @typedef {string} Locale
 * @typedef {string} MessageKey
 */

// Load all locale files at build time
const localeFiles = import.meta.glob('./locales/*.ftl', {
  query: '?raw',
  import: 'default',
  eager: true
});

export class Messages {

  #locale;
  #defaultLocale;
  /** @type {FluentBundle[]=} */
  #bundles;

  /**
   * @param {string} locale
   * @param {Locale=} defaultLocale
   */
  constructor(locale, defaultLocale) {
    this.#locale = locale;
    this.#defaultLocale = defaultLocale;
  }

  /**
   * Finds the most suited language files and loads the message bundles to
   * memory.
   *
   * @returns Same Messages instances this was invoked on.
   */
  async load() {
    const supportedLocales = Object.keys(localeFiles).reduce((acc, val) => {
      // val is like "./locales/en.ftl"
      const filename = val.split('/').pop(); // "en.ftl"
      if (filename) {
        const locale = filename.split('.')[0]; // "en"
        acc[locale] = val;
      }
      return acc;
    }, /** @type {Record<string, string>} */({}));

    const selectedLocales = negotiateLanguages(
      [this.#locale],
      Object.keys(supportedLocales),
      { defaultLocale: this.#defaultLocale },
    );

    this.#bundles = selectedLocales.map((selectedLocale) => {
      const bundle = new FluentBundle(selectedLocale);
      const filePath = supportedLocales[selectedLocale];
      // @ts-ignore - import.meta.glob returns strings with ?raw
      const contents = localeFiles[filePath];
      const resource = new FluentResource(contents);
      bundle.addResource(resource);
      return bundle;
    });

    return this;
  }

  /**
   * @param {MessageKey} key
   * @param {Record<string, any>=} attributes
   */
  t(key, attributes = {}) {
    if (!this.#bundles) {
      throw new Error('Messages#load has not been invoked or resolved yet.');
    }

    for (const bundle of this.#bundles) {
      const message = bundle.getMessage(key);

      if (!message?.value) {
        continue;
      }

      return bundle.formatPattern(message.value, attributes);
    }

    throw new Error(`Unknown or unsupported message key specified: ${key}`);
  }
}
