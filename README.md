# Classy Theme for JSON Resume

A minimalist theme for [JSON Resume](http://jsonresume.org/) which a fork from [JSON Resume Class Theme](https://github.com/jsonresume/jsonresume-theme-class) and a port from the fantastic [Minimal Latex CV](https://github.com/janvorisek/minimal-latex-cv) design. The content of the résumé can work offline and can be hosted without depending on or making requests to third-party servers.

## Usage
While the theme is still not pushed to npm, you can use it by cloning the repo.
```sh
# Install resume-cli via npm, yarn, pnpm, or whatever package manager you want
npm install --global resume-cli

# Clone the repo
git clone https://github.com/agsoto/jsonresume-theme-classy.git

# Enter the folder
cd jsonresume-theme-classy

# Install dependencies
npm install

# Export as an HTML page, ready to be served by any web server
resume export --theme . cv.html

# Export a PDF document, it's recommended to use your name as the file name
resume export --theme . cv.pdf
```

### Accessibility

It's recommended to declare the `meta.language` property in your JSON Resume for accessibility. This is the [BCP47 tag](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/lang#language_tag_syntax) for the language your résumé is written in. For example, `en` for English.

### For Servers

**Heads-up!** ⚠️ This project _doesn't_ sanitize the input/output. Typical usage is to run this locally with your own JSON Resume, so a trustworthy environment with trustworthy input. If this project will be deployed in a server environment, you must use a library like [DOMPurify](https://github.com/cure53/DOMPurify) to sanitize the output.

## Features

### JSON Resume 1.0.0

This supports the JSON Resume 1.0.0 spec.

<!-- ### Application Tracking System (ATS) Friendly

Many companies and recruiters use [ATS](https://wikipedia.org/wiki/Applicant_tracking_system) systems that [parse CVs](https://wikipedia.org/wiki/R%C3%A9sum%C3%A9_parsing) and extract the information into a standard format. We review some of these tools and adhere to standard practices while building the theme. -->

### Markdown

You can use Markdown in the following properties to make text bold, italic, or link them to external pages:

- `summary`
- `highlights`

### Localized

Using the same `meta.language` property referred to in [Accessibility](#accessibility), you can configure the language of the template too. For example, if you write your résumé in Dutch, the output will have Dutch headings.

### Open Graph Protocol

Populates the `head` of the HTML document with [Open Graph](https://ogp.me/) tags. This enables social media platforms and instant messengers to create embeds when your résumé is shared.

### Optimized

This theme makes no external connections, doesn't embed scripts, and is lightweight by design. Both HTML and PDF exports are minimal. External images accessed via HTTPS, can be embedded in the document automatically with the corresponding meta option.

## Preview

<img src="./assets/preview.png" width="49%" alt="The Class theme for JSON Resume rendered with mock data."/> <img src="./assets/preview-logo.png" width="49%" alt="The Class theme for JSON Resume rendered with mock data logo and some settings changed when dark mode is detected."/>
