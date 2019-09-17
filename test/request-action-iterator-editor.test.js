import { fixture, assert, html } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import '../request-action-iterator-editor.js';

describe('<request-action-iterator-editor>', function() {
  async function basicFixture() {
    const iterator = {
      source: 'test-source',
      operator: 'not-equal',
      condition: 'test-condition'
    };
    return (await fixture(html`
      <request-action-iterator-editor .iterator="${iterator}"></request-action-iterator-editor>`));
  }

  it('can be initialized without iterator', async () => {
    await fixture(html`
      <request-action-iterator-editor></request-action-iterator-editor>`);
  });

  describe('Model values initialization', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('source input has value', () => {
      const input = element.shadowRoot.querySelector('[name="iterator.source"]');
      assert.equal(input.value, 'test-source');
    });

    it('operator input has value', () => {
      const input = element.shadowRoot.querySelector('[name="iterator.operator"]');
      assert.equal(input.value, 'not-equal');
    });

    it('condition input has value', () => {
      const input = element.shadowRoot.querySelector('[name="iterator.condition"]');
      assert.equal(input.value, 'test-condition');
    });
  });

  describe('changing values', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('changes "source" property', async () => {
      const input = element.shadowRoot.querySelector('[name="iterator.source"]');
      const spy = sinon.spy();
      element.addEventListener('iterator-changed', spy);
      input.value = 'other';
      assert.isTrue(spy.called, 'event was dispatched');
      assert.equal(spy.args[0][0].detail.value.source, 'other', 'event has updated value');
      assert.equal(element.iterator.source, 'other', 'editor value is changed');
    });

    it('changes "operator" property', async () => {
      const input = element.shadowRoot.querySelector('[name="iterator.operator"]');
      const spy = sinon.spy();
      element.addEventListener('iterator-changed', spy);
      const item = input.shadowRoot.querySelector('anypoint-item');
      MockInteractions.tap(item);
      assert.isTrue(spy.called, 'event was dispatched');
      assert.equal(spy.args[0][0].detail.value.operator, 'equal', 'event has updated value');
      assert.equal(element.iterator.operator, 'equal', 'editor value is changed');
    });

    it('changes "condition" property', async () => {
      const input = element.shadowRoot.querySelector('[name="iterator.condition"]');
      const spy = sinon.spy();
      element.addEventListener('iterator-changed', spy);
      input.value = 'other';
      assert.isTrue(spy.called, 'event was dispatched');
      assert.equal(spy.args[0][0].detail.value.condition, 'other', 'event has updated value');
      assert.equal(element.iterator.condition, 'other', 'editor value is changed');
    });
  });

  describe('a11y', () => {
    it('is accessible', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element);
    });
  });
});
