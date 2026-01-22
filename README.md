# Minimal Classy Theme for JSON Resume

A minimalist theme for [JSON Resume](http://jsonresume.org/) which a fork from [JSON Resume Class Theme](https://github.com/jsonresume/jsonresume-theme-class) and a port from the fantastic [Minimal Latex CV](https://github.com/janvorisek/minimal-latex-cv) design. The content of the résumé can work offline and can be hosted without depending on or making requests to third-party servers.

## Usage
```sh
# Install resumed via npm, yarn, pnpm, or whatever package manager you want
npm install --global resumed jsonresume-theme-minimal-classy

# Export as an HTML page, ready to be served by any web server
resumed render ./resume.json --theme jsonresume-theme-minimal-classy

# Export a PDF document, it's recommended to use your name as the file name
resumed export ./resume.json --theme jsonresume-theme-minimal-classy
```

### Accessibility

It's recommended to declare the `meta.language` property in your JSON Resume for accessibility. This is the [BCP47 tag](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/lang#language_tag_syntax) for the language your résumé is written in. For example, `en` for English.

### For Servers

**Heads-up!** ⚠️ This project _doesn't_ sanitize the input/output. Typical usage is to run this locally with your own JSON Resume, so a trustworthy environment with trustworthy input. If this project will be deployed in a server environment, you must use a library like [DOMPurify](https://github.com/cure53/DOMPurify) to sanitize the output.

## Configuration

You can configure the theme by adding a `meta` object to your `resume.json`. The following options are supported:

| Option | Type | Description |
|--------|------|-------------|
| `language` | `string` | The [BCP47 tag](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/lang#language_tag_syntax) for the language of the résumé (e.g., `en`, `es`). Used for accessibility and localizing date formats. |
| `logo` | `string` | Path or URL to a logo image to display at the top of the résumé. |
| `labelUnderLogo` | `boolean` | If `true`, moves the label (job title) to be displayed under the logo instead of under the name. |
| `hideName` | `boolean` | If `true`, hides the name from the header. Useful if the logo already contains the name. |
| `disableImageStyling` | `boolean` | If `true`, removes the default circular mask and grayscale filter from the profile image. |
| `selfContainedImages` | `boolean` | If `true`, remote images (URLs) are downloaded and embedded as Base64 strings in the HTML output. Local images are always embedded. |
| `customStyles` | `string` | Custom CSS to inject into the `<head>` of the document. |

### Example

```json
"meta": {
  "language": "en",
  "selfContainedImages": true,
  "hideName": true,
  "logo": "./test/logo.svg",
  "labelUnderLogo": true,
  "disableImageStyling": false,
  "customStyles": ".label-text { letter-spacing: 5px; margin: -10px 0 0 0; }"
}
```

## Features

### JSON Resume 1.0.0

This supports the JSON Resume 1.0.0 spec.

### Highly Configurable

This theme offers extensive configuration options via the `meta` object, allowing you to:
- Toggle image styling (circle mask, grayscale)
- Hide the name if included in a logo
- Position the label/title
- Inject custom CSS for fine-grained control
- Embed remote images for offline usage

### Markdown

You can use Markdown in the following properties to make text bold, italic, or link them to external pages:

- `summary`
- `highlights`

### Extended References

You can add contact details to your references. This theme supports `email`, `phone`, and `url` fields in the `references` objects. You can see [fixture.resume.json](https://github.com/agsoto/jsonresume-theme-minimal-classy/blob/main/test/fixture.resume.json) for reference.

### Localized

Using the same `meta.language` property referred to in [Accessibility](#accessibility), you can configure the language of the template too. For example, if you write your résumé in Dutch, the output will have Dutch headings.

### Open Graph Protocol

Populates the `head` of the HTML document with [Open Graph](https://ogp.me/) tags. This enables social media platforms and instant messengers to create embeds when your résumé is shared.

### Optimized

This theme makes no external connections, doesn't embed scripts, and is lightweight by design. Both HTML and PDF exports are minimal. External images accessed via HTTPS, can be embedded in the document automatically with the corresponding meta option.

## Preview

<img src="./assets/preview.png" width="49%" alt="The Class theme for JSON Resume rendered with mock data."/> <img src="./assets/preview-logo.png" width="49%" alt="The Class theme for JSON Resume rendered with mock data logo and some settings changed when dark mode is detected."/>
