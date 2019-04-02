[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/request-actions-panel.svg)](https://www.npmjs.com/package/@advanced-rest-client/request-actions-panel)

[![Build Status](https://travis-ci.org/advanced-rest-client/request-actions-panel.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/request-actions-panel)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/request-actions-panel)

# request-actions-panel

A panel to define request actions for Advanced REST Client.


```html
<request-actions-panel date="2010-12-10T11:50:45Z" year="numeric" month="narrow" day="numeric"></request-actions-panel>
```

### API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

## Usage

### Installation
```
npm install --save @advanced-rest-client/request-actions-panel
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@advanced-rest-client/request-actions-panel/request-actions-panel.js';
    </script>
  </head>
  <body>
    <request-actions-panel></request-actions-panel>
  </body>
</html>
```

### In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer';
import '@advanced-rest-client/request-actions-panel/request-actions-panel.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
    <request-actions-panel></request-actions-panel>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Installation

```sh
git clone https://github.com/advanced-rest-client/request-actions-panel
cd api-url-editor
npm install
npm install -g polymer-cli
```

### Running the demo locally

```sh
polymer serve --npm
open http://127.0.0.1:<port>/demo/
```

### Running the tests
```sh
polymer test --npm
```
