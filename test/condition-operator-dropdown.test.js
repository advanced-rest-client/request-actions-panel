import { fixture, assert, html, aTimeout } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import '../condition-operator-dropdown.js';

describe('<condition-operator-dropdown>', function() {
  async function basicFixture() {
    return (await fixture(html`
      <condition-operator-dropdown></condition-operator-dropdown>`));
  }

  async function valueFixture() {
    return (await fixture(html`
      <condition-operator-dropdown value="greater-than"></condition-operator-dropdown>`));
  }

  it('dispatches value-changed event when selecting value', async () => {
    const element = await basicFixture();
    const dropdown = element.shadowRoot.querySelector('anypoint-dropdown-menu');
    MockInteractions.tap(dropdown);
    await aTimeout();
    const item = element.shadowRoot.querySelector('[value="contains"]');
    const spy = sinon.spy();
    element.addEventListener('value-changed', spy);
    item.click();
    assert.isTrue(spy.called, 'event was dispatched');
    assert.equal(spy.args[0][0].detail.value, 'contains');
  });

  it('has pre-selected value', async () => {
    const element = await valueFixture();
    const dropdown = element.shadowRoot.querySelector('anypoint-dropdown-menu');
    assert.equal(dropdown.value, 'Greater than');
  });

  describe('a11y', () => {
    it('is accessible', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element);
    });
  });
});
