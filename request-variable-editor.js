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
import '../../@advanced-rest-client/arc-icons/arc-icons.js';
import '../../@polymer/paper-input/paper-input.js';
import '../../@polymer/paper-toggle-button/paper-toggle-button.js';
import '../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../@advanced-rest-client/paper-combobox/paper-combobox.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
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
 * @polymer
 * @customElement
 * @memberof UiElements
 * @demo demo/index.html
 */
class RequestVariableEditor extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      padding: 0 12px;
      margin: 12px 0;
      @apply --arc-font-body1;
      @apply --request-variable-editor;
    }

    .item {
      @apply --layout-horizontal;
      @apply --layout-center;
    }

    paper-combobox,
    paper-input {
      @apply --layout-flex;
      margin-right: 12px;
    }
    </style>
    <div class="item">
      <paper-toggle-button class="enable-button" checked="{{action.enabled}}" disabled="[[readonly]]"></paper-toggle-button>
      <paper-combobox label="Variable name" required="" auto-validate="" value="{{action.variable}}" source="[[variablesSuggestions]]" readonly="[[readonly]]"></paper-combobox>
      <paper-input label="Variable value" value="{{action.value}}" disabled="[[readonly]]"></paper-input>
      <paper-icon-button icon="arc:clear" on-click="remove" title="Remove request action" disabled="[[readonly]]"></paper-icon-button>
    </div>
`;
  }

  static get is() {return 'request-variable-editor';}
  static get properties() {
    return {
      /**
       * Definied action.
       */
      action: {
        type: Object,
        notify: true
      },
      /**
       * List of variables sugesstions to display in the combo box.
       */
      variablesSuggestions: Array,
      /**
       * Renders the editor in read only mode
       */
      readonly: Boolean
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

  /**
   * Dispatched when the user requested to remove the item.
   * @event remove-action-item
   */
}
window.customElements.define(RequestVariableEditor.is, RequestVariableEditor);
