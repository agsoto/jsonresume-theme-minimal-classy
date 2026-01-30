import Handlebars from 'handlebars';
import { minify } from 'html-minifier';
import { marked } from 'marked';
import { Messages } from './i18n/messages.js';

import template from './resume.handlebars?raw';
import css from './style.css?raw';

/** @type {Intl.DateTimeFormatOptions} */
const LONG_DATE_FORMAT = { month: 'short', year: 'numeric', timeZone: 'UTC' };
/** @type {Intl.DateTimeFormatOptions} */
const SHORT_DATE_FORMAT = { year: 'numeric', timeZone: 'UTC' };



/**
 * Plugins to enable to minify HTML after generating from the template.
 */
const minifyOptions = {
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  decodeEntities: true,
  minifyCSS: true,
  removeComments: true,
  removeRedundantAttributes: true,
  sortAttributes: true,
  sortClassName: true,
};

Handlebars.registerHelper('markdown', /** @param {string} body */(body) => {
  return marked.parse(body);
});

Handlebars.registerHelper('link', /** @param {string} body */(body) => {
  const parsed = new URL(body);
  const host = (parsed.host.startsWith('www.')) ? parsed.host.substring(4) : parsed.host;
  return `<a href="${body}">${host}</a>`;
});

Handlebars.registerHelper('formatLocation', /** @param {object} location */ (location) => {
  if (!location) {
    return '';
  }

  const parts = [
    location.address,
    location.postalCode,
    location.city,
    location.region,
    location.countryCode
  ].filter(Boolean);

  if (parts.length === 0) {
    return '';
  }

  return parts.join(', ');
});


/**
 * @param {any} resume
 * @returns {Promise<string>}
 */
export async function render(resume) {

  const locale = resume.meta?.language || 'en-US';
  const messages = await new Messages(locale, 'en').load();
  Handlebars.registerHelper('i18n', /** @param {string} key @param {string=} name @param {string=} value */ (key, name, value) => {
    return messages.t(key, name ? {
      [name]: value
    } : {});
  });

  Handlebars.registerHelper('date', /** @param {string} body */(body) => {
    if (!body) {
      return messages.t('present');
    }

    const date = new Date(body);
    const datetime = date.toISOString();
    let localeString = body.split('-').length !== 1
      ? date.toLocaleDateString(locale, LONG_DATE_FORMAT)
      : date.toLocaleDateString(locale, SHORT_DATE_FORMAT);
    localeString = localeString.substring(0, 1).toUpperCase() + localeString.substring(1);
    return `<time datetime="${datetime}">${localeString}</time>`;
  });

  if (resume.basics?.image) {
    if (resume.basics.image.match(/^https?:\/\//)) {
      resume.custom = resume.custom || {};
      resume.custom.ogImage = resume.basics.image;
    }
    resume.basics.image = await resolveImage(resume.basics.image, resume.meta?.selfContainedImages);
  }

  if (resume.meta?.logo) {
    resume.meta.logo = await resolveImage(resume.meta.logo, resume.meta?.selfContainedImages);
  }
  
  if (resume.references) {
    resume.references.forEach(ref => {
      ref.hasFooter = !!(ref.email || ref.phone || ref.url);
    });
  }

  const html = Handlebars.compile(template)({
    css,
    resume
  });

  return minify(html, minifyOptions);
}

/**
 * Resolve an image path or URL to a base64 string or return as is.
 * @param {string} image
 * @param {boolean} [selfContained]
 * @returns {Promise<string>}
 */
async function resolveImage(image, selfContained) {
  // Handle base64 (no processing needed)
  if (image.startsWith('data:')) {
    return image;
  }

  // Handle Web URL
  if (image.match(/^https?:\/\//)) {
    if (selfContained) {
      try {
        const response = await fetch(image);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const contentType = response.headers.get('content-type') || 'image/jpeg';
          const base64 = await arrayBufferToBase64(arrayBuffer);
          return `data:${contentType};base64,${base64}`;
        }
      } catch (error) {
        console.warn('Failed to download image for self-contained build:', error);
      }
    }
    return image;
  }

  // Handle Local Path (Relative or Absolute)
  try {
    // Dynamically import fs/path to avoid breaking non-Node environments
    const fs = await import('node:fs');
    const path = await import('node:path');

    // Resolve path relative to current working directory
    const filePath = path.resolve(process.cwd(), image);

    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      // Simple mime type detection
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp'
      };
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      // fs.readFileSync returns a Buffer in Node, so we can use toString('base64')
      return `data:${contentType};base64,${fileBuffer.toString('base64')}`;
    } else {
      console.warn(`Local image not found: ${filePath}`);
    }
  } catch (err) {
    if (err.code !== 'ERR_MODULE_NOT_FOUND' && err.code !== 'MODULE_NOT_FOUND') {
      console.warn('Could not load local image (fs not available or error):', err);
    }
  }

  return image;
}

/**
 * Convert ArrayBuffer to Base64 string.
 * Tries to use Node.js Buffer if available, falls back to btoa.
 * @param {ArrayBuffer} buffer
 * @returns {Promise<string>}
 */
async function arrayBufferToBase64(buffer) {
  try {
    // Dynamically import Buffer to avoid hard dependency
    const { Buffer } = await import('node:buffer');
    return Buffer.from(buffer).toString('base64');
  } catch (e) {
    // Fallback for environments without node:buffer
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    // btoa is available in modern browsers and Node.js >= 16
    return btoa(binary);
  }
}
