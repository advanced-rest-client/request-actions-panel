import { html } from 'lit-html';
import { ArcDemoPage } from '@advanced-rest-client/arc-demo-helper/ArcDemoPage.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@advanced-rest-client/arc-models/variables-model.js';
import '@advanced-rest-client/variables-manager/variables-manager.js';
import '../request-actions-panel.js';

class DemoPage extends ArcDemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'compatibility',
      'outlined',
      'beforeactions',
      'afteractions',
      'readOnly'
    ]);
    this._componentName = 'request-actions-panel';
    this.demoStates = ['Filled', 'Outlined', 'Anypoint'];
    this._demoStateHandler = this._demoStateHandler.bind(this);
    this._toggleMainOption = this._toggleMainOption.bind(this);
    this._actionChanged = this._actionChanged.bind(this);
  }

  _toggleMainOption(e) {
    const { name, checked } = e.target;
    this[name] = checked;
  }

  _demoStateHandler(e) {
    const state = e.detail.value;
    this.outlined = state === 1;
    this.compatibility = state === 2;
  }

  _actionChanged(e) {
    const name = e.type.split('-')[0];
    const { value } = e.detail;
    this[name] = JSON.stringify(value, null, 2);
    console.log(name, value);
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      outlined,
      beforeactions,
      afteractions,
      readOnly
    } = this;
    return html`
      <section class="documentation-section">
        <h2>Interactive demo</h2>
        <p>
          This demo lets you preview the Google Drive browser element with various
          configuration options.
        </p>

        <arc-interactive-demo
          .states="${demoStates}"
          @state-chanegd="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <request-actions-panel
            ?compatibility="${compatibility}"
            .outlined="${outlined}"
            ?readOnly="${readOnly}"
            slot="content"
            @beforeactions-changed="${this._actionChanged}"
            @afteractions-changed="${this._actionChanged}"
          ></request-actions-panel>
        </arc-interactive-demo>
      </section>

      <section class="documentation-section">
        <h2>Result</h2>
        <h3>Before request actions</h3>
        <output>${beforeactions}</output>
        <h3>After request actions</h3>
        <output>${afteractions}</output>
      </section>
    `;
  }

  contentTemplate() {
    return html`
      <variables-model></variables-model>
      <variables-manager></variables-manager>
      <h2>Request actions panel</h2>
      ${this._demoTemplate()}
    `;
  }
}

const instance = new DemoPage();
instance.render();
window._demo = instance;
