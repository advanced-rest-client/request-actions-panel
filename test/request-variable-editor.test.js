import { fixture, assert, html } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import '../request-variable-editor.js';

describe('<request-variable-editor>', function() {
  async function basicFixture() {
    const action = {
      enabled: true,
      variable: 'test-var',
      value: 'test-value'
    };
    return (await fixture(html`
      <request-variable-editor .action="${action}"></request-variable-editor>`));
  }

  it('can be initialized without iterator', async () => {
    await fixture(html`
      <request-variable-editor></request-variable-editor>`);
  });

  describe('Model values initialization', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('enables the switch button', () => {
      const button = element.shadowRoot.querySelector('[name="action.enabled"]');
      assert.isTrue(button.checked);
    });

    it('variable input has value', () => {
      const button = element.shadowRoot.querySelector('[name="action.variable"]');
      assert.equal(button.value, 'test-var');
    });

    it('value input has value', () => {
      const button = element.shadowRoot.querySelector('[name="action.value"]');
      assert.equal(button.value, 'test-value');
    });
  });

  describe('changing values', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('changes "enabled" property', async () => {
      const button = element.shadowRoot.querySelector('[name="action.enabled"]');
      const spy = sinon.spy();
      element.addEventListener('action-changed', spy);
      MockInteractions.tap(button);
      assert.isTrue(spy.called, 'event was dispatched');
      assert.isFalse(spy.args[0][0].detail.value.enabled, 'event has updated value');
      assert.isFalse(element.action.enabled, 'editor value is changed');
    });

    it('changes "variable" property', async () => {
      const input = element.shadowRoot.querySelector('[name="action.variable"]');
      const spy = sinon.spy();
      element.addEventListener('action-changed', spy);
      input.value = 'other';
      assert.isTrue(spy.called, 'event was dispatched');
      assert.equal(spy.args[0][0].detail.value.variable, 'other', 'event has updated value');
      assert.equal(element.action.variable, 'other', 'editor value is changed');
    });

    it('changes "value" property', async () => {
      const input = element.shadowRoot.querySelector('[name="action.value"]');
      const spy = sinon.spy();
      element.addEventListener('action-changed', spy);
      input.value = 'other';
      assert.isTrue(spy.called, 'event was dispatched');
      assert.equal(spy.args[0][0].detail.value.value, 'other', 'event has updated value');
      assert.equal(element.action.value, 'other', 'editor value is changed');
    });
  });

  describe('removing property', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('disaptches remove event', async () => {
      const button = element.shadowRoot.querySelector('.delete-icon');
      const spy = sinon.spy();
      element.addEventListener('remove', spy);
      MockInteractions.tap(button);
      assert.isTrue(spy.called, 'event was dispatched');
    });
  });

  describe('a11y', () => {
    it('is accessible', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element);
    });
  });
});
