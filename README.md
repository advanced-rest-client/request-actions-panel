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

## Action data model

Action can be defined using following properties:

| Property | Type | Description |
| ----- | ----- | ----- |
| source | `String` | Source of the data to extract from the request or response object. See below this table for detailed description. |
| action | `String` | Action to perform. Currently supported are: `assign-variable` -updates variable value in memory, without storing them to the datastore; `store-variable` - updates and stores variable value in the datastore.
| destination | `String` | For variables manipulation it is the variable name. |
| enabled | `Boolean` | If sent to false then the action is ignored. |

### Source option and data path

With source string you can instruct the runner from where to take the value for
action. General structure is:

```
source object . data type [. pRequest action editor. Allows to build data model for request action using
convinient UI.

## Element use example

```
<request-action-editor action="{{action}}" opened></request-action-editor>
```

## Action data model

Action can be defined using following properties:

| Property | Type | Description |
| ----- | ----- | ----- |
| source | `String` | Source of the data to extract from the request or response object. See below this table for detailed description. |
| action | `String` | Action to perform. Currently supported are: `assign-variable` -updates variable value in memory, without storing them to the datastore; `store-variable` - updates and stores variable value in the datastore.
| destination | `String` | For variables manipulation it is the variable name. |
| enabled | `Boolean` | If sent to false then the action is ignored. |

### Source option and data path

With source string you can instruct the runner from where to take the value for
action. General structureath]
```

Source object can be either `request` or `response`.

Data type describes type of the request / response data. Can be one of:
-   url - URL associated with the request / response
-   status - Only for response data source object. Response's status code.
-   header - Request / response headers
-   body - Request / response body

Path allows to instruct the runner from where specifically in the data type get the value.

For `url` you can define the following properties:
-   host - Returns the host value, e.g. `api.domain.com`
-   protocol - Returns URL protocol, e.g. `https:`
-   path - URL's path, e.g. `/path/to/resource.json`
-   query - Returns full query string, e.g. `version=1&page=test`
-   query.{any string} - Returns the value of a query parameter. For `query.version` it would return `1`
-   hash - Returns everything that is after the `#` character, e.g. `access_token=token&state=A6RT7W`
-   hast.{any string} - It treats hash as a query parameters and returns the value of the parameter. For `hash.access_token` it would return `token`

For `body` you can define path to the value for XML and JSON data only.
Any other content type will result with `undefined` value.

Path to the data is a JSON path to the value (also for XML).

```javascript
const json = {
  property: {
    otherProperty: {
      value: 123456
    }
  }
};
const path = 'property.otherProperty.value';
// This will return 123456
```

To access array values put the index in the path:

```javascript
const json = {
  items: [{
    otherProperty: {
      value: 123456
    }
  }]
};
const path = 'items.0.otherProperty.value';
// This will return 123456
```

Similar for XML:

```javascript
const xmlStr = `<?xml version="1.0"?>
<people xmlns:xul="some.xul">
  <person db-id="test1">
    <name first="george" last="bush" />
    <address street="1600 pennsylvania avenue" city="washington" country="usa"/>
    <phoneNumber>202-456-1111</phoneNumber>
  </person>
  <person db-id="test2">
    <name first="tony" last="blair" />
    <address street="10 downing street" city="london" country="uk"/>
    <phoneNumber>020 7925 0918</phoneNumber>
  </person>
</people>`;
path = 'people.person.0.phoneNumber';
// returns 202-456-1111
```

XML path supports `attr(ATTRIBUTE NAME)` function that returns the value of the
attribute:

```javascript
path = 'people.person.0.name.attr(first)';
// returns george
```

## Conditions

You can add a condition to the action so the action will be executed if all conditions are meet.

Condition data model is:

```javascript
{
  source: 'String', // the same as for action
  operator: 'String', // see below for list of all operators
  condition: 'any', // value to use to compare the value get from the action `source` property
  enabled: 'Boolean' // false to ignore the condition.
}
```

Operator can be one of:

-   equal
-   not-equal
-   greater-than
-   greater-than-equal
-   less-than
-   less-than-equal
-   contains

Contains can operate on strings, simple arrays (e.g. `['test', 123]`) or objects (e.g. {'key':'value'}).

### Example

```javascript
const config = {
  source: 'request.body.items.0.name',
  action: 'assign-variable',
  destination: 'someValue',
  enabled: true,
  conditions: [{
    source: 'response.status',
    operator: 'equal',
    condition: 200,
    enabled: true
  }]
}
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
