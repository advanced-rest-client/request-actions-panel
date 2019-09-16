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
import '@anypoint-web-components/anypoint-combobox/anypoint-combobox.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import '@anypoint-web-components/anypoint-switch/anypoint-switch.js';
import '@anypoint-web-components/anypoint-dropdown-menu/anypoint-dropdown-menu.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '../request-condition-editor.js';
import '../request-action-iterator-editor.js';
/**
 * Request action editor. Allows to build data model for request action using convinient UI.
 *
 * ## Element use example
 *
 * ```
 * <request-action-editor action="{{action}}" opened></request-action-editor>
 * ```
 *
 *
 * @memberof UiElements
 * @customElement
 * @demo demo/index.html
 */
export class RequestActionEditor extends LitElement {
  static get styles() {
    return css`
    :host {
      display: block;
      padding: 0 12px;
      margin: 12px 0;
      background-color: var(--request-action-editor-background-color, inherit);
    }

    [hidden] {
      display: none !important;
    }

    header,
    .action-enabler,
    .iterator-enabler {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    header {
      height: var(--request-action-editor-closed-bar-height, 48px);
    }

    .form {
      padding-bottom: 12px;
    }

    .flex-spacer {
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      overflow: hidden;
    }

    .action-form {
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

    .destination {
      min-width: 320px;
      flex: 1;
    }

    .enable-button {
      padding: 12px 0;
    }

    .source-main {
      margin-right: 8px;
    }

    .action-type {
      margin-right: 8px;
    }

    .short-info {
      @apply --arc-font-body1;
      font-size: 15px;
      color: var(--request-action-editor-closed-info-color, rgba(0, 0, 0, 0.87));
    }

    .source-label {
      margin-right: 20px;
    }

    .source-label,
    .action-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .bottom-acctions {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .icon {
      display: block;
      width: 24px;
      height: 24px;
      fill: currentColor;
    }`;
  }

  _headerTemplate() {
    const {
      opened,
      readOnly,
      compatibility,
      actionStateLabel,
      actionLabel,
      togglePanelLabel
    } = this;
    const action = this.action || {};
    return html`
    <header>
      ${opened ? html`<span class="action-enabler">
        <anypoint-switch
          class="enable-button"
          .checked="${action.enabled}"
          ?disabled="${readOnly}"
          name="action.enabled"
          ?compatibility="${compatibility}"
          @checked-changed="${this._enabledHandler}"
        ></anypoint-switch>
        Action ${actionStateLabel}
      </span>` : ''}
      <span class="flex-spacer short-info">
        ${!opened ? html`<span class="source-label">${action.source}</span>
        <span class="action-label">${actionLabel}: ${action.destination}</span>` : ''}
      </span>
      <span>
        <anypoint-button
          class="toggle-editor"
          @click="${this.toggleOpened}"
        >${togglePanelLabel}</anypoint-button>
        <anypoint-button
          class="remove-action"
          @click="${this.remove}"
          ?disabled="${readOnly}"
        >Remove action</anypoint-button>
      </span>
    </header>`;
  }

  _sourceTemplate() {
    const {
      readOnly,
      compatibility,
      outlined,
      source
    } = this;
    return html`
    <anypoint-dropdown-menu
      dynamicalign
      ?disabled="${readOnly}"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
      class="source-main"
    >
      <label slot="label">Source</label>
      <anypoint-listbox
        slot="dropdown-content"
        attrforselected="value"
        ?compatibility="${compatibility}"
        .selected="${source}"
        data-name="source"
        @selected-changed="${this._selectionHandler}"
      >
        <anypoint-item value="request">Request</anypoint-item>
        <anypoint-item value="response">Response</anypoint-item>
      </anypoint-listbox>
    </anypoint-dropdown-menu>
    `;
  }

  _sourceTypeTemplate() {
    const {
      readOnly,
      compatibility,
      outlined,
      sourceType
    } = this;
    return html`
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
        ?compatibility="${compatibility}"
        data-name="sourceType"
        .selected="${sourceType}"
        @selected-changed="${this._selectionHandler}"
      >
        <anypoint-item value="url">Url</anypoint-item>
        <anypoint-item value="status">Status code</anypoint-item>
        <anypoint-item value="headers">Headers</anypoint-item>
        <anypoint-item value="body">Body</anypoint-item>
      </anypoint-listbox>
    </anypoint-dropdown-menu>
    `;
  }

  _pathTemplate() {
    const {
      readOnly,
      compatibility,
      outlined,
      sourcePath,
      pathHidden
    } = this;
    return html`<anypoint-input
      class="source-path"
      .value="${sourcePath}"
      name="sourcePath"
      @value-changed="${this._inputChanged}"
      ?readonly="${readOnly}"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
      ?hidden="${pathHidden}"
    >
      <label slot="label">Path to data (optional)</label>
    </anypoint-input>`;
  }

  _actionTemplate() {
    const {
      readOnly,
      compatibility,
      outlined
    } = this;
    const action = this.action || {};
    return html`
    <anypoint-dropdown-menu
      dynamicalign
      class="action-type"
      ?disabled="${readOnly}"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
    >
      <label slot="label">Result</label>
      <anypoint-listbox
        slot="dropdown-content"
        attrforselected="value"
        ?compatibility="${compatibility}"
        data-name="action.action"
        .selected="${action.action}"
        @selected-changed="${this._selectionHandler}"
      >
        <anypoint-item value="assign-variable">Assign variable</anypoint-item>
        <anypoint-item value="store-variable">Store variable</anypoint-item>
      </anypoint-listbox>
    </anypoint-dropdown-menu>
    `;
  }

  _variableTemplate() {
    const {
      readOnly,
      compatibility,
      outlined,
      variablesSuggestions
    } = this;
    const action = this.action || {};
    return html`<anypoint-combobox
      label="Variable name"
      required
      autovalidate
      name="action.destination"
      .value="${action.destination}"
      @value-changed="${this._inputChanged}"
      class="destination"
      .source="${variablesSuggestions}"
      ?disabled="${readOnly}"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
    ></anypoint-combobox>`;
  }

  _conditionsTemplate() {
    const {
      readOnly,
      compatibility,
      outlined
    } = this;
    const action = this.action || {};
    const conditions = action.conditions;
    if (!conditions || !conditions.length) {
      return '';
    }
    return html`<div class="conditions-form">
    ${conditions.map((item, index) => html`<request-condition-editor
      .condition="${item}"
      data-index="${index}"
      @remove-condition-item="${this._removeCondition}"
      ?readonly="${readOnly}"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
    ></request-condition-editor>`)}
    </div>`;
  }

  _actionsTemplate() {
    const {
      readOnly,
      compatibility,
      _renderIterator,
      iteratorStatusLabel
    } = this;
    const action = this.action || {};
    return html`
    <div class="bottom-acctions">
      <anypoint-button
        class="add-condition"
        @click="${this._appendCondition}"
        ?disabled="${readOnly}"
      >Add condition</anypoint-button>
      ${_renderIterator ? html`<span class="iterator-enabler">
        <anypoint-switch
          data-action="iterable-toggle"
          .checked="${action.hasIterator}"
          ?disabled="${readOnly}"
          name="action.hasIterator"
          ?compatibility="${compatibility}"
          @checked-changed="${this._enabledHandler}"
        ></anypoint-switch>
        Iterator ${iteratorStatusLabel}
      </span>` : ''}
    </div>
    `;
  }

  _iteratorTemplate() {
    const {
      readOnly,
      compatibility,
      outlined
    } = this;
    const action = this.action || {};
    if (!action.hasIterator) {
      return;
    }
    return html`<request-action-iterator-editor
      .iterator="${action.iterator}"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
      ?readonly="${readOnly}"
    ></request-action-iterator-editor>`;
  }

  _formTemplate() {
    return html`
    <div class="form">
      <div class="action-form">
        ${this._sourceTemplate()}
        ${this._sourceTypeTemplate()}
        ${this._pathTemplate()}
        ${this._actionTemplate()}
        ${this._variableTemplate()}
      </div>
      ${this._conditionsTemplate()}
      ${this._actionsTemplate()}
      ${this._iteratorTemplate()}
    </div>`;
  }

  render() {
    const { opened } = this;
    return html`
    ${this._headerTemplate()}
    <iron-collapse .opened="${opened}">
      ${this._formTemplate()}
    </iron-collapse>`;
  }

  static get properties() {
    return {
      /**
       * Definied action.
       */
      action: { type: Object, notify: true, },
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
       * List of variables sugesstions to display in the combo box.
       */
      variablesSuggestions: { type: Array },
      /**
       * True to open the editor view.
       */
      opened: { type: Boolean },

      _renderIterator: { type: Boolean },
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

  get actionStateLabel() {
    const action = this.action || {};
    return action.enabled ? 'enabled' : 'disabled';
  }

  get actionLabel() {
    const action = this.action || {};
    return action.action === 'assign-variable' ? 'Assign variable' : 'Store variable';
  }

  get togglePanelLabel() {
    return this.opened ? 'Hide editor' : 'Show editor';
  }

  get pathHidden() {
    return this.sourceType === 'status';
  }

  get iteratorStatusLabel() {
    const action = this.action || {};
    return action.hasIterator ? 'enabled' : 'disabled';
  }

  get _renderIterator() {
    const { source, sourceType } = this;
    if (source === 'response' && sourceType === 'body') {
      return true;
    }
    return false;
  }

  get action() {
    return this._action
  }

  set action(value) {
    const old = this._action;
    if (old === value) {
      return;
    }
    this._action = value;
    this.requestUpdate('action', value);
    this._actionChanged(value);
  }

  static get observers() {
    return [
      '_hasIteratorChanged(action.hasIterator)'
    ];
  }

  // Clears the path info.
  clear() {
    this.source = '';
    this.sourceType = '';
    this.sourcePath = '';
  }

  _actionChanged(action) {
    this.clear();
    if (action && action.source) {
      this._processSource(action.source);
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

  _computeSourcePath(source, sourceType, sourcePath) {
    let path = source || '';
    if (sourceType) {
      path += '.' + sourceType;
    }
    if (sourcePath) {
      path += '.' + sourcePath;
    }

    if (!this.action) {
      this.action = { source: path };
    } else {
      this.action.source = path;
    }
  }
  /**
   * Dispatches the `remove-action-item` custom event so the panel can remove
   * the item from the list.
   */
  remove() {
    this.dispatchEvent(new CustomEvent('remove-action-item'));
  }
  // Handler for add condition button click.
  _appendCondition() {
    this.addCondition();
  }
  /**
   * Adds a condition to conditions list.
   *
   * @param {?Object} opts Optional model properties for the condition.
   */
  addCondition(opts) {
    if (!opts) {
      opts = {};
    }
    let model = {
      source: 'response.status',
      operator: 'equal',
      condition: 200,
      enabled: true
    };
    model = Object.assign(model, opts);
    if (!this.action) {
      this.action = {};
    }
    if (!this.action.conditions) {
      this.action.conditions = [model];
    } else {
      this.action.conditions.push(model);
    }
  }
  /**
   * Handles delete of the condition.
   * @param {CustomEvent} e
   */
  _removeCondition(e) {
    const index = Number(e.target.dataset.index);
    const items = this.action.conditions;
    items.splice(index, 1);
    this.action.conditions = [...items];
    this.requestUpdate();
  }
  /**
   * Toggles opened state of the editor.
   */
  toggleOpened() {
    this.opened = !this.opened;
  }

  _hasIteratorChanged(enabled) {
    if (!enabled) {
      return;
    }
    if (this.action.iterator) {
      return;
    }
    this.set('action.iterator', {
      source: 'data.*.property',
      operator: 'equal',
      condition: ''
    });
  }

  _computeRenderIterator(source, sourceType) {
    if (source === 'response' && sourceType === 'body') {
      return true;
    }
    return false;
  }

  _inputChanged(e) {
    const { name, value } = e.target;
    const cndProp = name.indexOf('action') === 0;
    if (cndProp) {
      this.action[name] = value;
    } else {
      this[name] = value;
      this._computeSourcePath();
    }
    this._notify();
  }

  _enabledHandler(e) {
    const { name } = e.target;
    const value = e.detail.value;
    this.action[name] = value;
    this._notify();
  }

  _notify() {
    this.dispatchEvent(new CustomEvent('action-changed', {
      detail: {
        value: this.condition
      }
    }));
  }
}
