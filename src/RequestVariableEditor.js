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
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
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
export class RequestVariableEditor extends ActionBase {
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
      ${this._propertySwitchTemplate()}
      <anypoint-combobox
        required
        autovalidate
        .value="${action.variable}"
        .source="${variablesSuggestions}"
        ?readonly="${readOnly}"
        name="action.variable"
        @value-changed="${this._propertyInputChanged}"
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
        name="action.value"
        @value-changed="${this._propertyInputChanged}"
      >
        <label slot="label">Variable value</label>
      </anypoint-input>
      ${this._removeTemplate()}
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
      variablesSuggestions: { type: Array }
    };
  }

  constructor() {
    super();
    this._changeProperty = 'action';
  }
}
