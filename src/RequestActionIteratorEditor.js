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
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import '../condition-operator-dropdown.js';
/**
 * An editor for response iterator.
 *
 * It creates data model that is accetable in ARC elements ecosystem for creating iteration over a value (JSON, XML).
 *
 * Actions runner use this information to iterate over iterable objects like arrays or JS object.
 * Once it finds the match it returns the entire object to the action runner and
 * it takes the value from this object.
 *
 * ### Data model
 *
 * Condition data model is:
 *
 * ```javascript
 * {
 *    source: 'String', // See below for detailed description.
 *    operator: 'String', // see below for list of all operators
 *    condition: 'any' // value to use to compare the value get from the `source` property
 * }
 * ```
 *
 * #### source
 *
 * Path to the data. The iterable should be marked with `*` character.
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
 * - regexp
 *
 * Contains can operate on strings, simple arrays (e.g. `['test', 123]`) or objects (e.g. {'key':'value'}).
 *
 * ### Examples
 *
 * __Getting value from the same object.__
 *
 * ```javascript
 * // Action configuration
 * const config = {
 *    source: 'id',
 *    action: 'assign-variable',
 *    destination: 'personId',
 *    iterator: {
 *      source: 'items.*.name',
 *      operator: 'equal',
 *      condition: 'Smith'
 *    }
 *  }
 *  // Response
 *  const response = {
 *    items: [{
 *      id: 1234,
 *      name: 'Brown'
 *    }, {
 *      id: 5678,
 *      name: 'Smith'
 *    }]
 *  }
 * ```
 * Result of the above model would result with assigning `5678` to `personId` variable.
 *
 * __Getting value from nested object.__
 *
 * ```javascript
 * // Action configuration
 * const config = {
 *    source: 'address.zip',
 *    action: 'assign-variable',
 *    destination: 'personZip',
 *    iterator: {
 *      source: 'items.*.name',
 *      operator: 'equal',
 *      condition: 'Brown'
 *    }
 * }
 * // Response
 * const response = {
 *    items: [{
 *      id: 1234,
 *      name: 'Brown',
 *      address: {
 *        zip: 94101
 *      }
 *    }, {
 *      id: 5678,
 *      name: 'Smith',
 *      address: {
 *        zip: 94104
 *      }
 *    }]
 * }
 * ```
 *
 * Result of the above model would result with assigning `94101` to `personZip` variable.
 *
 * ### Styling
 *
 * `<request-action-iterator-editor>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--request-action-iterator-editor` | Mixin applied to the element | `{}`
 * `--request-action-iterator-editor-background-color` | Background color of the editor | `#fff`
 *
 * @memberof UiElements
 * @customElement
 * @demo demo/index.html
 */
export class RequestActionIteratorEditor extends LitElement {
  static get styles() {
    return css`
    :host {
      display: block;
      background-color: var(--request-action-iterator-editor-background-color, #fff);
      padding: 12px;
      margin: 12px 0;
    }

    [hidden] {
      display: none !important;
    }

    .form {
      flex: 1;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
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

    .condition-type {
      margin-right: 8px;
    }

    .info {
      color: var(--request-action-iterator-editor-info-color, #757575);
    }
    `;
  }

  render() {
    const {
      readOnly,
      compatibility,
      outlined
    } = this;
    const iterator = this.iterator || {};
    return html`
    <style>

    </style>
    <div class="info">
      <p>
        Iterate over arrays and objects in response body to trigger the action on maching object.
        Add <code>*</code> symbol for iterable object
      </p>
    </div>
    <div class="form">
      <anypoint-input
        .value="${iterator.source}"
        name="source"
        class="source-path"
        ?readonly="${readOnly}"
        ?compatibility="${compatibility}"
        ?outlined="${outlined}"
      >
        <label slot="label">Path to data (optional)</label>
      </anypoint-input>
      <condition-operator-dropdown
        class="condition-type"
        .value="${iterator.operator}"
        ?readonly="${readOnly}"
        ?compatibility="${compatibility}"
        ?outlined="${outlined}"
      ></condition-operator-dropdown>
      <anypoint-input
        required
        autovalidate
        .value="${iterator.condition}"
        name="condition"
        class="condition"
        ?readonly="${readOnly}"
        ?compatibility="${compatibility}"
        ?outlined="${outlined}"
      >
        <label slot="label">Condition value</label>
      </anypoint-input>
    </div>`;
  }

  static get properties() {
    return {
      /**
       * Model for iterator.
       */
      iterator: { type: Object },
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
      outlined: { type: Boolean },
    };
  }

  _inputChanged(e) {
    const { name, value } = e.target;
    this.iterator[name] = value;
    this._notify();
  }

  _notify() {
    this.dispatchEvent(new CustomEvent('iterator-changed', {
      detail: {
        value: this.action
      }
    }));
  }
}
