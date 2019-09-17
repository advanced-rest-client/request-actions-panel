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
import { ActionBase } from './ActionBase.js';
import { html, css } from 'lit-element';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-combobox/anypoint-combobox.js';
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
export class RequestActionEditor extends ActionBase {
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

      _renderIterator: { type: Boolean }
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

  get _pathHidden() {
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

  constructor() {
    super();
    this._changeProperty = 'action';
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
    this.requestUpdate();
    this._notifyChangeProperty();
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
    this._notifyChangeProperty();
  }
  /**
   * Toggles opened state of the editor.
   */
  toggleOpened() {
    this.opened = !this.opened;
  }

  _iteratorChanged(e) {
    this._propertyEnabledHandler(e);
    if (!e.detail.value || this.action.iterator) {
      return;
    }
    this.action.iterator = {
      source: 'data.*.property',
      operator: 'equal',
      condition: ''
    };
    this.requestUpdate();
    this._notifyChangeProperty();
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
        ${this._propertySwitchTemplate()}
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
          ?compatibility="${compatibility}"
        >${togglePanelLabel}</anypoint-button>
        <anypoint-button
          class="remove-action"
          @click="${this.remove}"
          ?compatibility="${compatibility}"
          ?disabled="${readOnly}"
        >Remove action</anypoint-button>
      </span>
    </header>`;
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
        @selected-changed="${this._propertySelectionHandler}"
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
      required
      autovalidate
      name="action.destination"
      .value="${action.destination}"
      @value-changed="${this._propertyInputChanged}"
      class="destination"
      .source="${variablesSuggestions}"
      ?disabled="${readOnly}"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
    >
      <label slot="label">Variable name</label>
    </anypoint-combobox>`;
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
      @condition-changed="${this._notifyChangeProperty}"
      data-index="${index}"
      @remove="${this._removeCondition}"
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
          data-update-ui="true"
          .checked="${action.hasIterator}"
          ?disabled="${readOnly}"
          name="action.hasIterator"
          ?compatibility="${compatibility}"
          @checked-changed="${this._iteratorChanged}"
        >
          Iterator ${iteratorStatusLabel}
        </anypoint-switch>
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
      @iterator-changed="${this._notifyChangeProperty}"
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
}
