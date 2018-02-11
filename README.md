[![Build Status](https://travis-ci.org/advanced-rest-client/request-actions-panel.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/request-actions-panel)  

# request-actions-panel

A panel to create and edit request actions.

### Example
```
<request-actions-panel actions="{{requestActions}}"></request-actions-panel>
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
source object . data type [. path]
```

Source object can be either `request` or `response`.

Data type describes type of the request / response data. Can be one of:
- url - URL associated with the request / response
- status - Only for response data source object. Response's status code.
- header - Request / response headers
- body - Request / response body

Path allows to instruct the runner from where specifically in the data type get the value.

For `url` you can define the following properties:
- host - Returns the host value, e.g. `api.domain.com`
- protocol - Returns URL protocol, e.g. `https:`
- path - URL's path, e.g. `/path/to/resource.json`
- query - Returns full query string, e.g. `version=1&page=test`
- query.[any string] - Returns the value of a query parameter. For `query.version` it would return `1`
- hash - Returns everything that is after the `#` character, e.g. `access_token=token&state=A6RT7W`
- hast.[any string] - It treats hash as a query parameters and returns the value of the parameter. For `hash.access_token` it would return `token`

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
- equal
- not-equal
- greater-than
- greater-than-equal
- less-than
- less-than-equal
- contains

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

### Styling
`<request-actions-panel>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--request-actions-panel` | Mixin applied to the element | `{}`
`--request-actions-panel-title` | Mixin applied to the title element. | `{}`
`--request-actions-panel-empty-screen-color` | Color of the empty screen | `#707070`



### Events
| Name | Description | Params |
| --- | --- | --- |
| request-actions-updated |  | actions **Array.<Object>** - List of current actions. |
# request-action-editor

Request action editor. Allows to build data model for request action using
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
action. General structure is:

```
source object . data type [. path]
```

Source object can be either `request` or `response`.

Data type describes type of the request / response data. Can be one of:
- url - URL associated with the request / response
- status - Only for response data source object. Response's status code.
- header - Request / response headers
- body - Request / response body

Path allows to instruct the runner from where specifically in the data type get the value.

For `url` you can define the following properties:
- host - Returns the host value, e.g. `api.domain.com`
- protocol - Returns URL protocol, e.g. `https:`
- path - URL's path, e.g. `/path/to/resource.json`
- query - Returns full query string, e.g. `version=1&page=test`
- query.[any string] - Returns the value of a query parameter. For `query.version` it would return `1`
- hash - Returns everything that is after the `#` character, e.g. `access_token=token&state=A6RT7W`
- hast.[any string] - It treats hash as a query parameters and returns the value of the parameter. For `hash.access_token` it would return `token`

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
- equal
- not-equal
- greater-than
- greater-than-equal
- less-than
- less-than-equal
- contains

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

### Styling
`<request-action-editor>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--request-action-editor` | Mixin applied to the element | `{}`
`--request-action-editor-background-color` | Background color of the editor | `rgba(0, 162, 223, 0.05)`
`--request-action-editor-closed-bar-height` | Height of the item when collapsed. | `48px`
`--request-action-editor-closed-info-color` | Color of the collapsed info label | `rgba(0, 0, 0, 0.87)`

# request-condition-editor

An editor for request / response editors.
It creates data model that is accetable in ARC elements ecosystem for conditions.

### Data model

Condition data model is:

```javascript
{
  source: 'String', // See below for detailed description.
  operator: 'String', // see below for list of all operators
  condition: 'any' // value to use to compare the value get from the action `source` property
}
```

#### source

Instructs the condition runner from where to take the value for the condition.
General structure is:

```
source object . data type [. path]
```

Source object can be either `request` or `response`.

Data type describes type of the request / response data. Can be one of:

- url - URL associated with the request / response
- status - Only for response data source object. Response's status code.
- header - Request / response headers
- body - Request / response body

Path allows to instruct the runner from where specifically in the data type get the value.

For `url` you can define the following properties:
- host - Returns the host value, e.g. `api.domain.com`
- protocol - Returns URL protocol, e.g. `https:`
- path - URL's path, e.g. `/path/to/resource.json`
- query - Returns full query string, e.g. `version=1&page=test`
- query.[any string] - Returns the value of a query parameter. For `query.version` it would return `1`
- hash - Returns everything that is after the `#` character, e.g. `access_token=token&state=A6RT7W`
- hast.[any string] - It treats hash as a query parameters and returns the value of the parameter. For `hash.access_token` it would return `token`

For `body` you can define path to the value for XML and JSON data only.
Any other content type will result with `undefined` value.

#### operator

Operator can be one of:
- equal
- not-equal
- greater-than
- greater-than-equal
- less-than
- less-than-equal
- contains

Contains can operate on strings, simple arrays (e.g. `['test', 123]`) or objects (e.g. {'key':'value'}).

### Example

```javascript
const config = {
  source: 'request.body.items.0.name',
  action: 'assign-variable',
  destination: 'someValue',
  conditions: [{
    source: 'response.status',
    operator: 'equal',
    condition: 200
  }]
}
```

### Example
```
<request-condition-editor condition="{{condition}}"></request-condition-editor>
```

### Styling
`<request-actions-panel>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--request-condition-editor` | Mixin applied to the element | `{}`
`--request-condition-editor-background-color` | Background color of the editor | `#fff`
`--inline-fom-action-icon-color` | Color of the delete icon | `rgba(0, 0, 0, 0.74)`
`--inline-fom-action-icon-color-hover` | Color of the delete icon when hovering | `--accent-color` or `rgba(0, 0, 0, 0.74)`



### Events
| Name | Description | Params |
| --- | --- | --- |
| remove-condition-item | Non bubbling event notifying parent element that this condition is to be deleted. | __none__ |
