/**
@license
Copyright 2016 The Advanced REST client authors <arc@mulesoft.com>
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
import { VariablesConsumerMixin } from '@advanced-rest-client/variables-consumer-mixin/variables-consumer-mixin.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import { helpOutline } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '../request-action-editor.js';
import '../request-variable-editor.js';
/**
 * A panel to create and edit request actions.
 *
 * ### Example
 *
 * ```html
 * <request-actions-panel actions="{{requestActions}}"></request-actions-panel>
 * ```
 *
 * ## Action data model
 *
 * Action can be defined using following properties:
 *
 * **source** (`String`)
 *
 * Source of the data to extract from the request or response object. See section
 * below for detailed description.
 *
 * **action** (`String`)
 *
 * Action to perform. Currently supported are: `assign-variable` - updates
 * variable value in memory, without storing them to the datastore;
 * `store-variable` - updates and stores variable value in the datastore.
 *
 *
 * **destination** (`String`)
 *
 * For variables manipulation it is the variable name.
 *
 *
 * **enabled** (`Boolean`)
 *
 * If sent to false then the action is ignored.
 *
 * ### Source option and data path
 *
 * With source string you can instruct the runner from where to take the value for
 * action. General structure is:
 *
 * ```
 * source object . data type [. path]
 * ```
 *
 * Source object can be either `request` or `response`.
 *
 * Data type describes type of the request / response data. Can be one of:
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
 * - query.[any string] - Returns the value of a query parameter. For
 * `query.version` it would return `1`
 * - hash - Returns everything that is after the `#` character, e.g.
 * `access_token=token&state=A6RT7W`
 * - hast.[any string] - It treats hash as a query parameters and returns
 * the value of the parameter. For `hash.access_token` it would return `token`
 *
 * For `body` you can define path to the value for XML and JSON data only.
 * Any other content type will result with `undefined` value.
 *
 * Path to the data is a JSON path to the value (also for XML).
 *
 * ```javascript
 * const json = {
 *   property: {
 *     otherProperty: {
 *       value: 123456
 *     }
 *   }
 * };
 * const path = 'property.otherProperty.value';
 * // This will return 123456
 * ```
 *
 * To access array values put the index in the path:
 *
 * ```javascript
 * const json = {
 *   items: [{
 *     otherProperty: {
 *       value: 123456
 *     }
 *   }]
 * };
 * const path = 'items.0.otherProperty.value';
 * // This will return 123456
 * ```
 *
 * Similar for XML:
 *
 * ```javascript
 * const xmlStr = `<?xml version="1.0"?>
 * <people xmlns:xul="some.xul">
 *   <person db-id="test1">
 *     <name first="george" last="bush" />
 *     <address street="1600 pennsylvania avenue" city="washington" country="usa"/>
 *     <phoneNumber>202-456-1111</phoneNumber>
 *   </person>
 *   <person db-id="test2">
 *     <name first="tony" last="blair" />
 *     <address street="10 downing street" city="london" country="uk"/>
 *     <phoneNumber>020 7925 0918</phoneNumber>
 *   </person>
 * </people>`;
 * path = 'people.person.0.phoneNumber';
 * // returns 202-456-1111
 * ```
 *
 * XML path supports `attr(ATTRIBUTE NAME)` function that returns the value of the
 * attribute:
 *
 * ```javascript
 * path = 'people.person.0.name.attr(first)';
 * // returns george
 * ```
 *
 * ## Conditions
 *
 * You can add a condition to the action so the action will be executed if all conditions are meet.
 *
 * Condition data model is:
 * ```javascript
 * {
 *   source: 'String', // the same as for action
 *   operator: 'String', // see below for list of all operators
 *   condition: 'any', // value to use to compare the value get from the action `source` property
 *   enabled: 'Boolean' // false to ignore the condition.
 * }
 * ```
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
 * Contains can operate on strings, simple arrays (e.g. `['test', 123]`)
 * or objects (e.g. {'key':'value'}).
 *
 * ### Example
 *
 * ```javascript
 * const config = {
 *   source: 'request.body.items.0.name',
 *   action: 'assign-variable',
 *   destination: 'someValue',
 *   enabled: true,
 *   conditions: [{
 *     source: 'response.status',
 *     operator: 'equal',
 *     condition: 200,
 *     enabled: true
 *   }]
 * }
 * ```
 *
 * ## Iterables
 *
 * Value for action can be extracted from the response body after iteraiting over
 * iterable data types (array, object). In this case action's `source` property
 * should be relative to the object that matches ierator definition.
 *
 * Iterables can be mixed with conditions. Conditions are checked first, before
 * action is performed.
 *
 * ### Example
 *
 * Getting value from the same object.
 *
 * ```javascript
 * // Action configuration
 * const config = {
 *   source: 'id',
 *   action: 'assign-variable',
 *   destination: 'personId',
 *   iterator: {
 *     source: 'items.*.name',
 *     operator: 'equal',
 *     condition: 'Smith'
 *   }
 * }
 * // Response
 * const response = {
 *   items: [{
 *     id: 1234,
 *     name: 'Brown'
 *   }, {
 *     id: 5678,
 *     name: 'Smith'
 *   }]
 * }
 * ```
 * Result of the above model would result with assigning `5678` to `personId` variable.
 *
 * ### Styling
 *
 * `<request-actions-panel>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--request-actions-panel` | Mixin applied to the element | `{}`
 * `--request-actions-panel-title` | Mixin applied to the title element. | `{}`
 * `--request-actions-panel-empty-screen-color` | Color of the empty screen | `#707070`
 *
 * @memberof UiElements
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @appliesMixin VariablesConsumerMixin
 */
export class RequestActionsPanel extends VariablesConsumerMixin(LitElement) {
  static get styles() {
    return css`
    :host {
      display: block;
      padding: 12px;
    }

    header {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    h3 {
      margin: 0;
      font-size: var(--arc-font-subhead-font-size);
      font-weight: var(--arc-font-subhead-font-weight);
      line-height: var(--arc-font-subhead-line-height);
    }

    .help-button {
      margin-left: 12px;
    }

    .empty-screen {
      color: var(--request-actions-panel-empty-screen-color, #000);
      margin: 20px 0;
    }

    .info-header {
      font-size: 0.95rem;
    }

    .action-button {
      height: 40px;
    }

    .request-actions-section {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px var(--request-actions-panel-section-border-bottom-color, #BDBDBD) solid;
    }

    .icon {
      display: block;
      width: 24px;
      height: 24px;
      fill: currentColor;
    }
  `;
  }

  _helpButton() {
    const {
      readOnly,
      compatibility
    } = this;
    return html`<anypoint-icon-button
      class="help-button icon"
      @click="${this._seekHelp}"
      aria-label="Activate to open help article"
      ?disabled="${readOnly}"
      ?compatibility="${compatibility}"
    >
      <span class="icon">${helpOutline}</span>
    </anypoint-icon-button>`;
  }

  _createButtonTemplate(handler, label) {
    const {
      readOnly,
      compatibility
    } = this;
    return html`<anypoint-button
      class="action-button"
      emphasis="low"
      @click="${handler}"
      ?compatibility="${compatibility}"
      ?disabled="${readOnly}"
    >${label}</anypoint-button>`;
  }

  _preActionsTemplate() {
    const items = this.beforeActions.variables;
    if (!items || !items.length) {
      return '';
    }
    const {
      readOnly,
      compatibility,
      outlined,
      _variables
    } = this;
    return items.map((item, index) => html`
    <request-variable-editor
      data-index="${index}"
      .action="${item}"
      .variablesSuggestions="${_variables}"
      @remove="${this._removePreItem}"
      @action-changed="${this._notifyRequests}"
      ?readOnly="${readOnly}"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
    ></request-variable-editor>`);
  }

  _postActionsTemplate() {
    const items = this.afterActions;
    if (!items || !items.length) {
      return '';
    }
    const {
      readOnly,
      compatibility,
      outlined,
      _variables
    } = this;
    return items.map((item, index) => html`
    <request-action-editor
      data-index="${index}"
      .action="${item}"
      .variablesSuggestions="${_variables}"
      opened
      @action-changed="${this._notifyResponses}"
      @remove="${this._removePostItem}"
      ?readOnly="${readOnly}"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
    ></request-action-editor>`);
  }

  _requestTemplate() {
    const {
      hasRequestActions
    } = this;
    return html`
    <section class="request-actions-section">
      <header>
        <h3>Before request</h3>
        ${this._helpButton()}
      </header>
      ${hasRequestActions ? html`
        ${this._preActionsTemplate()}
        ${this._createButtonTemplate(this._addPreActionHandler, 'Add request action')}
      ` : html`
      <div class="empty-screen">
        <p class="info-header">Define actions to be performed <b>before</b> request start.</p>
        ${this._createButtonTemplate(this._addPreActionHandler, 'Create request action')}
      </div>`}
    </section>`;
  }

  _responseTemplate() {
    const {
      hasResponseActions
    } = this;
    return html`<section class="response-actions-section">
      <header>
        <h3>After response</h3>
        ${this._helpButton()}
      </header>

      ${hasResponseActions ? html`
        ${this._postActionsTemplate()}
        ${this._createButtonTemplate(this._addPostActionHandler, 'Add response action')}
      ` : html`
      <div class="empty-screen">
        <p class="info-header">Define actions to be performed when <b>response is ready</b>.</p>
        ${this._createButtonTemplate(this._addPostActionHandler, 'Create response action')}
      </div>`}
    </section>`;
  }

  render() {
    return html`
    ${this._requestTemplate()}
    ${this._responseTemplate()}`;
  }

  static get properties() {
    return {
      /**
       * Model for actions to be preformed after the request
       */
      afterActions: { type: Array },
      /**
       * Model for actions to be preformed before the request
       */
      beforeActions: { type: Array },
      /**
       * Renders the editor in read only mode
       */
      readOnly: Boolean,
      /**
       * Enables compatibility with Anypoint platform
       */
      compatibility: { type: Boolean },
      /**
       * Enables Material Design Outlined inputs
       */
      outlined: { type: Boolean },

      _variables: {
        type: Array,
        computed: '_processVariables(variables.*)'
      }
    };
  }
  /**
   * @return {Boolean} True if any action is defined.
   */
  get hasActions() {
    return this.hasRequestActions || this.hasResponseActions;
  }

  get hasRequestActions() {
    const actions = this.beforeActions || {};
    const items = actions.variables || [];
    return !!(items && items.length);
  }

  get hasResponseActions() {
    const items = this.afterActions || [];
    return !!(items && items.length);
  }

  constructor() {
    super();
    this._variablesHandler = this._variablesHandler.bind(this);
    this.beforeActions = {};
    this.afterActions = [];
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.addEventListener('variables-chnaged', this._variablesHandler);
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.removeEventListener('variables-chnaged', this._variablesHandler);
  }

  /**
   * Opens documentation page for the module.
   *
   * @return {Window|undefined} reference to newly created window if not
   * handled by `open-external-url` event.
   */
  _seekHelp() {
    const url = 'https://docs.advancedrestclient.com/using-arc/request-actions';
    const e = new CustomEvent('open-external-url', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        url: url
      }
    });
    this.dispatchEvent(e);
    if (e.defaultPrevented) {
      return;
    }
    return window.open(url);
  }
  /**
   * Computes value for `hasPostActions` based on post actions.
   * @param {Array|undefined} value Current post actions
   */
  _afterActionsChanged(value) {
    const has = !!value;
    this._setHasPostActions(has);
  }
  /**
   * Computes value for `hasPreActions` based on pre actions.
   * @param {Array|undefined} value Current pre actions
   */
  _beforeActionsChanged(value) {
    const has = !!value;
    this._setHasPreActions(has);
  }
  /**
   * Computes value for `hasActions` propety.
   *
   * @param {Boolean} hasPostActions Current value of hasPostActions
   * @param {Boolean} hasPreActions Current value of hasPreActions
   * @return {Boolean} True if any action is defined.
   */
  _computeHasActions(hasPostActions, hasPreActions) {
    return hasPostActions || hasPreActions;
  }

  _addPostActionHandler() {
    this.addPostAction();
  }

  _addPreActionHandler() {
    this.addPreAction();
  }
  /**
   * Adds a post action to the UI.
   * @param {?Object} opts Default values for model.
   */
  addPostAction(opts) {
    if (!opts) {
      opts = {};
    }
    let model = {
      source: 'response.body',
      action: 'assign-variable',
      destination: 'myVar',
      enabled: true
    };
    model = Object.assign(model, opts);
    const items = this.afterActions || [];
    items.push(model);
    this.afterActions = [...items];
    this._notifyResponses();
  }

  /**
   * Adds a pre action to the UI
   * @param {?Object} opts Default values for model.
   */
  addPreAction(opts) {
    if (!opts) {
      opts = {};
    }
    let model = {
      variable: 'myVar',
      value: '',
      enabled: true
    };
    model = Object.assign(model, opts);
    if (!this.beforeActions) {
      this.beforeActions = {};
    }
    const items = this.beforeActions.variables || [];
    items.push(model);
    this.beforeActions.variables = items;
    this.requestUpdate();
    this._notifyRequests();
  }

  _removePostItem(e) {
    const index = Number(e.target.dataset.index);
    const items = this.afterActions;
    items.splice(index, 1);
    this.afterActions = [...items];
    this._notifyResponses();
  }

  _removePreItem(e) {
    const index = Number(e.target.dataset.index);
    const items = this.beforeActions.variables;
    items.splice(index, 1);
    this.beforeActions.variables = items;
    this.requestUpdate();
    this._notifyRequests();
  }
  /**
   * Filters out variables that can't be used in the editor and returns
   * a list of variable names.
   *
   * @param {CustomEvent} e
   */
  _variablesHandler(e) {
    const vars = e.detail.value || [];
    const result = [];
    vars.forEach((item) => {
      if (item.enabled === false) {
        return;
      }
      result[result.length] = item.variable;
    });
    this._variables = result;
  }

  _notifyRequests() {
    this.dispatchEvent(new CustomEvent('beforeactions-changed', {
      detail: {
        value: this.beforeActions
      }
    }));
  }

  _notifyResponses() {
    this.dispatchEvent(new CustomEvent('afteractions-changed', {
      detail: {
        value: this.afterActions
      }
    }));
  }
}
