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
import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import '../../@polymer/iron-flex-layout/iron-flex-layout.js';
import '../../@polymer/paper-input/paper-input.js';
import '../../@polymer/paper-dropdown-menu/paper-dropdown-menu-light.js';
import '../../@polymer/paper-listbox/paper-listbox.js';
import '../../@polymer/paper-item/paper-item.js';
import './condition-operator-dropdown.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
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
 * @polymer
 * @demo demo/index.html
 */
class RequestActionIteratorEditor extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      background-color: var(--request-action-iterator-editor-background-color, #fff);
      padding: 12px;
      margin: 12px 0;
      @apply --arc-font-body1;
      @apply --request-action-iterator-editor;
    }

    [hidden] {
      display: none !important;
    }

    .form {
      @apply --layout-flex;
      @apply --layout-horizontal;
      @apply --layout-wrap;
    }

    .source-path {
      min-width: 320px;
      margin-right: 8px;
      @apply --layout-flex;
    }

    .condition {
      min-width: 320px;
      @apply --layout-flex;
    }

    .condition-type {
      margin-right: 8px;
    }

    .info {
      color: var(--request-action-iterator-editor-info-color, #757575);
      @apply --arc-font-body1;
    }
    </style>
    <div class="info">
      <p>Iterate over arrays and objects in response body to trigger the action on maching object. Add <code>*</code> symbol for iterable object</p>
    </div>
    <div class="form">
      <paper-input label="Path to data (optional)" value="{{iterator.source}}" class="source-path" required="" disabled="[[readonly]]"></paper-input>
      <condition-operator-dropdown class="condition-type" value="{{iterator.operator}}" required="" readonly="[[readonly]]"></condition-operator-dropdown>
      <paper-input label="Condition value" required="" auto-validate="" value="{{iterator.condition}}" class="condition" disabled="[[readonly]]"></paper-input>
    </div>
`;
  }

  static get is() {
    return 'request-action-iterator-editor';
  }
  static get properties() {
    return {
      /**
       * Model for iterator.
       */
      iterator: {
        type: Object,
        notify: true
      },
      /**
       * Renders the editor in read only mode
       */
      readonly: Boolean
    };
  }
}
window.customElements.define(RequestActionIteratorEditor.is, RequestActionIteratorEditor);
