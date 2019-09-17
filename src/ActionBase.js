import { LitElement, html } from 'lit-element';
import { clear } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import '@anypoint-web-components/anypoint-dropdown-menu/anypoint-dropdown-menu.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@anypoint-web-components/anypoint-switch/anypoint-switch.js';

export class ActionBase extends LitElement {
  static get properties() {
    return {
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
      /**
       * Name of the property to change in the deep path.
       * Here it is either `condition` or `action`
       */
      _changeProperty: { type: String }
    };
  }

  /**
   * Sets path info variables when action's source change.
   * @param {String} source Current source of the action.
   */
  _processSource(source) {
    const parts = (source || '').split('.');
    this.source = parts[0] || '';
    this.sourceType = parts[1] || '';
    this.sourcePath = parts.splice(2).join('.');
  }

  _computeSourcePath() {
    const { source, sourceType, sourcePath } = this;
    let path = source || '';
    if (sourceType) {
      path += '.' + sourceType;
    }
    if (sourcePath && sourceType !== 'status') {
      path += '.' + sourcePath;
    }
    if (!this[this._changeProperty]) {
      this[this._changeProperty] = {};
    }
    this[this._changeProperty].source = path;
    this._notifyChangeProperty();
  }

  _propertyName(name) {
    const prop = this._changeProperty;
    if (!prop) {
      return name;
    }
    if (name.indexOf('.') === -1) {
      return name;
    }
    const i = name.indexOf(prop);
    if (i === -1) {
      return name;
    }
    return name.substr(prop.length + 1);
  }

  _propertyInputChanged(e) {
    const { name, value } = e.target;
    const propName = this._propertyName(name);
    if (propName === name) {
      this[name] = value;
      this._computeSourcePath();
    } else {
      this[this._changeProperty][propName] = value;
      this._notifyChangeProperty();
    }
  }

  _propertyEnabledHandler(e) {
    const { name } = e.target;
    const { value } = e.detail;
    const propName = this._propertyName(name);
    if (propName === name) {
      this[name] = value;
    } else {
      this[this._changeProperty][propName] = value;
      this._notifyChangeProperty();
    }
    if (e.target.dataset.updateUi) {
      this.requestUpdate();
    }
  }

  _propertySelectionHandler(e) {
    const { value } = e.detail;
    const { name } = e.target.dataset;
    const propName = this._propertyName(name);
    if (propName === name) {
      this[name] = value;
      this._computeSourcePath();
    } else {
      this[this._changeProperty][propName] = value;
      this._notifyChangeProperty();
    }
  }

  _notifyChangeProperty() {
    this.dispatchEvent(new CustomEvent(`${this._changeProperty}-changed`, {
      detail: {
        value: this[this._changeProperty]
      }
    }));
  }

  /**
   * Dispatches the `remove` custom event so the panel can remove
   * the item from the list.
   */
  remove() {
    this.dispatchEvent(new CustomEvent('remove'));
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
        @selected-changed="${this._propertySelectionHandler}"
      >
        <anypoint-item value="url">Url</anypoint-item>
        <anypoint-item value="status">Status code</anypoint-item>
        <anypoint-item value="headers">Headers</anypoint-item>
        <anypoint-item value="body">Body</anypoint-item>
      </anypoint-listbox>
    </anypoint-dropdown-menu>
    `;
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
        @selected-changed="${this._propertySelectionHandler}"
      >
        <anypoint-item value="request">Request</anypoint-item>
        <anypoint-item value="response">Response</anypoint-item>
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
      _pathHidden
    } = this;
    return html`<anypoint-input
      class="source-path"
      .value="${sourcePath}"
      name="sourcePath"
      @value-changed="${this._propertyInputChanged}"
      ?readonly="${readOnly}"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
      ?hidden="${_pathHidden}"
    >
      <label slot="label">Path to data (optional)</label>
    </anypoint-input>`;
  }

  _removeTemplate() {
    const {
      readOnly,
      compatibility
    } = this;
    return html`<anypoint-icon-button
      class="delete-icon"
      @click="${this.remove}"
      title="Remove condition"
      ?disabled="${readOnly}"
      ?compatibility="${compatibility}"
    >
      <span class="icon">${clear}</span>
    </anypoint-icon-button>`;
  }

  _propertySwitchTemplate() {
    const {
      readOnly,
      compatibility,
      _changeProperty
    } = this;
    const propName = `${_changeProperty}.enabled`;
    const property = this[_changeProperty] || {};
    const checked = property.enabled;
    return html`<anypoint-switch
      class="enable-button"
      .checked="${checked}"
      ?disabled="${readOnly}"
      name="${propName}"
      ?compatibility="${compatibility}"
      @checked-changed="${this._propertyEnabledHandler}"
      aria-label="Activate to enable or disable this item"
    ></anypoint-switch>`;
  }
}
