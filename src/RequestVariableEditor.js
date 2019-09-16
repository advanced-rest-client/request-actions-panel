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
import { clear } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import '@anypoint-web-components/anypoint-switch/anypoint-switch.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@anypoint-web-components/anypoint-combobox/anypoint-combobox.js';
/**
 * Variable editor allows to edit variables in actions editor.
 *
 * ### Styling
 *
 * `<request-variable-editor>` provides the following custom properties and
 * mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--request-variable-editor` | Mixin applied to the element | `{}`
 *
 * @customElement
 * @memberof UiElements
 * @demo demo/index.html
 */
export class RequestVariableEditor extends LitElement {
  static get styles() {
    return css`
    :host {
      display: block;
      padding: 0 12px;
      margin: 12px 0;
    }

    .item {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    anypoint-combobox,
    anypoint-input {
      flex: 1;
      margin-right: 12px;
    }

    .icon {
      display: block;
      width: 24px;
      height: 24px;
      fill: currentColor;
    }
    `;
  }

  render() {
    const {
      readOnly,
      variablesSuggestions,
      compatibility,
      outlined
    } = this;
    const action = this.action || {};
    return html`
    <div class="item">
      <anypoint-switch
        class="enable-button"
        .checked="${action.enabled}"
        ?disabled="${readOnly}"
        name="enabled"
        ?compatibility="${compatibility}"
        @checked-changed="${this._enabledHandler}"></anypoint-switch>
      <anypoint-combobox
        required
        autovalidate
        .value="${action.variable}"
        .source="${variablesSuggestions}"
        ?readonly="${readOnly}"
        name="variable"
        @value-changed="${this._inputChanged}"
        ?compatibility="${compatibility}"
        ?outlined="${outlined}"
      >
        <label slot="label">Variable name</label>
      </anypoint-combobox>
      <anypoint-input
        .value="${action.value}"
        ?readonly="${readOnly}"
        ?compatibility="${compatibility}"
        ?outlined="${outlined}"
        name="value"
        @value-changed="${this._inputChanged}"
      >
        <label slot="label">Variable value</label>
      </anypoint-input>
      <anypoint-icon-button
        @click="${this.remove}"
        title="Remove request action"
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
       * Definied action.
       */
      action: { type: Object },
      /**
       * List of variables sugesstions to display in the combo box.
       */
      variablesSuggestions: { type: Array },
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
  /**
   * Dispatches the `remove-action-item` custom event so the panel can remove
   * the item from the list.
   */
  remove() {
    this.dispatchEvent(new CustomEvent('remove-action-item', {
      bubbles: false
    }));
  }

  _inputChanged(e) {
    const { name, value } = e.target;
    this.action[name] = value;
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
        value: this.action
      }
    }));
  }

  /**
   * Dispatched when the user requested to remove the item.
   * @event remove-action-item
   */
}
