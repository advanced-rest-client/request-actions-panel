/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { LitElement, html, css } from 'lit-element';
import { clear } from '@advanced-rest-client/arc-icons/arc-icons.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@anypoint-web-components/anypoint-switch/anypoint-switch.js';
import '@anypoint-web-components/anypoint-dropdown-menu/anypoint-dropdown-menu.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '../condition-operator-dropdown.js';
/**
 * An editor for request / response editors.
 * It creates data model that is accetable in ARC elements ecosystem for conditions.
 *
 * ### Data model
 *
 * Condition data model is:
 *
 * ```javascript
 * {
 *   source: 'String', // See below for detailed description.
 *   operator: 'String', // see below for list of all operators
 *   condition: 'any' // value to use to compare the value get from the action `source` property
 * }
 * ```
 *
 * #### source
 *
 * Instructs the condition runner from where to take the value for the condition.
 * General structure is:
 *
 * ```
 * source object . data type [. path]
 * ```
 *
 * Source object can be either `request` or `response`.
 *
 * Data type describes type of the request / response data. Can be one of:
 *
 * - url - URL associated with the request / response
 * - status - Only for response data source object. Response's status code.
 * - header - Request / response headers
 * - body - Request / response body
 *
 * Path allows to instruct the runner from where specifically in the data type get the value.
 *
 * For `url` you can define the following properties:
 * - host - Returns the host value, e.g. `api.domain.com`
 * - protocol - Returns URL protocol, e.g. `https:`
 * - path - URL's path, e.g. `/path/to/resource.json`
 * - query - Returns full query string, e.g. `version=1&page=test`
 * - query.[any string] - Returns the value of a query parameter. For `query.version` it would return `1`
 * - hash - Returns everything that is after the `#` character, e.g. `access_token=token&state=A6RT7W`
 * - hast.[any string] - It treats hash as a query parameters and returns the value of the parameter.
 * For `hash.access_token` it would return `token`
 *
 * For `body` you can define path to the value for XML and JSON data only.
 * Any other content type will result with `undefined` value.
 *
 * #### operator
 *
 * Operator can be one of:
 * - equal
 * - not-equal
 * - greater-than
 * - greater-than-equal
 * - less-than
 * - less-than-equal
 * - contains
 *
 * Contains can operate on strings, simple arrays (e.g. `['test', 123]`) or objects (e.g. {'key':'value'}).
 *
 * ### Example
 *
 * ```javascript
 * const config = {
 *   source: 'request.body.items.0.name',
 *   action: 'assign-variable',
 *   destination: 'someValue',
 *   conditions: [{
 *     source: 'response.status',
 *     operator: 'equal',
 *     condition: 200
 *   }]
 * }
 * ```
 *
 * @memberof UiElements
 * @customElement
 * @demo demo/index.html
 */
export class RequestConditionEditor extends LitElement {
  static get styles() {
    return css`
    :host {
      display: block;
      background-color: var(--request-condition-editor-background-color, #fff);
      padding: 12px;
      margin: 12px 0;
    }

    [hidden] {
      display: none !important;
    }

    .container {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
    }

    .form {
      flex: 1;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }

    .source-type {
      margin-right: 8px;
    }

    .source-path {
      min-width: 320px;
      margin-right: 8px;
      flex: 1;
    }

    .condition {
      min-width: 320px;
      flex: 1;
    }

    .enable-button {
      padding: 12px 0;
      margin-right: 8px;
    }

    .source-main {
      margin-right: 8px;
    }

    .condition-type {
      margin-right: 8px;
    }

    .icon {
      display: block;
      width: 24px;
      height: 24px;
      fill: currentColor;
    }`;
  }

  render() {
    const {
      readOnly,
      condition,
      compatibility,
      outlined,
      sourceType,
      source,
      sourcePath,
      _pathHidden
    } = this;
    return html`
    <div class="container">
      <anypoint-switch
        class="enable-button"
        checked="${condition.enabled}"
        ?disabled="${readOnly}"
        name="enabled"
        ?compatibility="${compatibility}"
        @checked-changed="${this._enabledHandler}"
      ></anypoint-switch>
      <div class="form">
        <anypoint-dropdown-menu
          dynamicalign
          class="source-main"
          ?disabled="${readOnly}"
          ?compatibility="${compatibility}"
          ?outlined="${outlined}"
        >
          <label slot="label">Source</label>
          <anypoint-listbox
            slot="dropdown-content"
            attrforselected="value"
            ?compatibility="${this.compatibility}"
            data-name="source"
            .selected="${source}"
            @selected-changed="${this._selectionHandler}">
            <anypoint-item value="request">Request</anypoint-item>
            <anypoint-item value="response">Response</anypoint-item>
          </anypoint-listbox>
        </anypoint-dropdown-menu>

        <anypoint-dropdown-menu
          dynamicalign
          class="source-type"
          ?disabled="${readOnly}"
          ?compatibility="${compatibility}"
          ?outlined="${outlined}"
        >
          <label slot="label">Type</label>
          <anypoint-listbox
            slot="dropdown-content"
            attrforselected="value"
            ?compatibility="${this.compatibility}"
            data-name="sourceType"
            .selected="${sourceType}"
            @selected-changed="${this._selectionHandler}">
            <anypoint-item value="url">Url</anypoint-item>
            <anypoint-item value="status">Status code</anypoint-item>
            <anypoint-item value="headers">Headers</anypoint-item>
            <anypoint-item value="body">Body</anypoint-item>
          </anypoint-listbox>
        </anypoint-dropdown-menu>

        <anypoint-input
          class="source-path"
          .value="${sourcePath}"
          name="sourcePath"
          @value-changed="${this._inputChanged}"
          ?readonly="${readOnly}"
          ?compatibility="${compatibility}"
          ?outlined="${outlined}"
          ?hidden="${_pathHidden}"
        >
          <label slot="label">Path to data (optional)</label>
        </anypoint-input>

        <condition-operator-dropdown
          class="condition-type"
          .value="${condition.operator}"
          ?readonly="${readOnly}"
          ?compatibility="${compatibility}"
          ?outlined="${outlined}"
          name="condition.operator"
          @value-changed="${this._inputChanged}"
        ></condition-operator-dropdown>

        <anypoint-input
          required
          autovalidate
          class="condition"
          .value="${condition.condition}"
          name="condition.condition"
          @value-changed="${this._inputChanged}"
          ?readonly="${readOnly}"
          ?compatibility="${compatibility}"
          ?outlined="${outlined}"
        >
          <label slot="label">Condition value</label>
        </anypoint-input>
      </div>
      <anypoint-icon-button
        class="delete-icon"
        @click="${this.remove}"
        title="Remove condition"
        ?disabled="${readOnly}"
        ?compatibility="${compatibility}"
      >
        <span class="icon">${clear}</span>
      </anypoint-icon-button>
    </div>
`;
  }

  static get properties() {
    return {
      /**
       * Definied condition.
       */
      condition: {
        type: Object,
        notify: true,
        observer: '_conditionChanged'
      },
      /**
       * Value computed from the `action.source` property.
       * Binded to source input field.
       */
      source: { type: String },
      /**
       * Value computed from the `action.source` property.
       * Binded to source type input field.
       */
      sourceType: { type: String },
      /**
       * Value computed from the `action.source` property.
       * Binded to path input field.
       */
      sourcePath: { type: String },
      /**
       * Renders the editor in read only mode
       */
      readOnly: { type: Boolean },
      /**
       * Enables compatibility with Anypoint platform
       */
      compatibility: { type: Boolean },
      /**
       * Enables Material Design Outlined inputs
       */
      outlined: { type: Boolean }
    };
  }

  get _pathHidden() {
    return this.sourceType === 'status';
  }

  get condition() {
    return this._condition
  }

  set condition(value) {
    const old = this._condition;
    if (old === value) {
      return;
    }
    this._condition = value;
    this.requestUpdate('condition', value);
    this._conditionChanged(value);
  }

  // Clears the path info.
  clear() {
    this.source = '';
    this.sourceType = '';
    this.sourcePath = '';
  }

  _conditionChanged(condition) {
    this.clear();
    if (condition && condition.source) {
      this._processSource(condition.source);
    }
  }
  /**
   * Sets path info variables when action's source change.
   * @param {String} source Current source of the action.
   */
  _processSource(source) {
    const parts = source.split('.');
    this.source = parts[0] || '';
    this.sourceType = parts[1] || '';
    this.sourcePath = parts.splice(2).join('.');
  }

  _computeSourcePath() {
    const { source, sourceType, sourcePath } = this;
    let path = source || '';
    if (sourceType) {
      path += '.' + sourceType;
    }
    if (sourcePath) {
      path += '.' + sourcePath;
    }
    this.condition.source = path;
  }
  /**
   * Dispatches the `remove-action-item` custom event so the panel can remove
   * the item from the list.
   */
  remove() {
    this.dispatchEvent(new CustomEvent('remove-condition-item', {
      bubbles: false
    }));
  }
  // Computes if path input should be hidden.
  _computePathHidden(sourceType) {
    return sourceType === 'status';
  }

  _inputChanged(e) {
    const { name, value } = e.target;
    const cndProp = name.indexOf('condition') === 0;
    if (cndProp) {
      this.condition[name] = value;
    } else {
      this[name] = value;
      this._computeSourcePath();
    }
    this._notify();
  }

  _enabledHandler(e) {
    const { name } = e.target;
    const value = e.detail.value;
    this.condition[name] = value;
    this._notify();
  }

  _notify() {
    this.dispatchEvent(new CustomEvent('condition-changed', {
      detail: {
        value: this.condition
      }
    }));
  }
  /**
   * Non bubbling event notifying parent element that this condition is
   * to be deleted.
   * @event remove-condition-item
   */
}
