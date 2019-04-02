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
import {mixinBehaviors} from '../../@polymer/polymer/lib/legacy/class.js';
import {IronFormElementBehavior} from '../../@polymer/iron-form-element-behavior/iron-form-element-behavior.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import '../../@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../@polymer/paper-listbox/paper-listbox.js';
import '../../@polymer/paper-item/paper-item.js';
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
 * @polymer
 * @customElement
 * @memberof UiElements
 * @demo demo/index.html
 * @appliesMixin Polymer.IronFormElementBehavior
 */
class ConditionOperatorDropdown extends
  mixinBehaviors([IronFormElementBehavior], PolymerElement) {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      @apply --condition-operator-dropdown;
    }

    .condition-type {
      @apply --condition-operator-dropdown-menu;
    }
    </style>
    <paper-dropdown-menu
      label="Operator"
      dynamic-align=""
      class="condition-type"
      name="[[name]]"
      required\$="[[required]]"
      disabled="[[readonly]]">
      <paper-listbox slot="dropdown-content" selected="{{value}}" attr-for-selected="value">
        <paper-item value="equal">Equal</paper-item>
        <paper-item value="not-equal">Not equal</paper-item>
        <paper-item value="greater-than">Greater than</paper-item>
        <paper-item value="greater-than-equal">Greater than or equal</paper-item>
        <paper-item value="less-than">Less than</paper-item>
        <paper-item value="less-than-equal">Less than or equal</paper-item>
        <paper-item value="contains">Contains</paper-item>
        <paper-item value="regex">Regular expression</paper-item>
      </paper-listbox>
    </paper-dropdown-menu>
`;
  }

  static get is() {
    return 'condition-operator-dropdown';
  }

  static get properties() {
    return {
      /**
       * Renders the editor in read only mode
       */
      readonly: Boolean
    };
  }
}
window.customElements.define(ConditionOperatorDropdown.is, ConditionOperatorDropdown);
