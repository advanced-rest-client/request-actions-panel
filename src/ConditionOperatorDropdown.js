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
import '@anypoint-web-components/anypoint-dropdown-menu/anypoint-dropdown-menu.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
/**
 * Variable editor allows to edit variables in actions editor.
 *
 * ### Styling
 *
 * `<condition-operator-dropdown>` provides the following custom properties and
 * mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--condition-operator-dropdown` | Mixin applied to the element | `{}`
 * `--condition-operator-dropdown-background-color` | Background color of the
 * editor | `rgba(0, 162, 223, 0.05)`
 *
 * @customElement
 * @memberof UiElements
 * @demo demo/index.html
 */
export class ConditionOperatorDropdown extends LitElement {
  static get styles() {
    return css`:host {
      display: inline-block;
    }`;
  }

  render() {
    return html`
    <anypoint-dropdown-menu
      dynamicalign
      ?disabled="${this.readOnly}"
      ?compatibility="${this.compatibility}"
      ?outlined="${this.outlined}"
    >
      <label slot="label">Operator</label>
      <anypoint-listbox
        slot="dropdown-content"
        attrforselected="value"
        ?compatibility="${this.compatibility}"
        .selected="${this.value}"
        @selected-changed="${this._selectionHandler}">
        <anypoint-item value="equal">Equal</anypoint-item>
        <anypoint-item value="not-equal">Not equal</anypoint-item>
        <anypoint-item value="greater-than">Greater than</anypoint-item>
        <anypoint-item value="greater-than-equal">Greater than or equal</anypoint-item>
        <anypoint-item value="less-than">Less than</anypoint-item>
        <anypoint-item value="less-than-equal">Less than or equal</anypoint-item>
        <anypoint-item value="contains">Contains</anypoint-item>
        <anypoint-item value="regex">Regular expression</anypoint-item>
      </anypoint-listbox>
    </anypoint-dropdown-menu>`;
  }

  static get properties() {
    return {
      /**
       * Renders the editor in read only mode
       */
      readOnly: { type: Boolean },
      /**
       * Operator value
       */
      value: { type: String },
      /**
       * Name of the control
       */
      name: { type: String },
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

  _selectionHandler(e) {
    const { value } = e.detail;
    this.value = value;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: {
        value
      }
    }));
  }
}
