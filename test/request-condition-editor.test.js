import { fixture, assert, html, nextFrame } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import '../request-condition-editor.js';

describe('<request-condition-editor>', function() {
  async function basicFixture() {
    const condition = {
      enabled: true,
      source: 'request.body.data',
      operator: 'not-equal',
      condition: 'test-condition'
    };
    return (await fixture(html`
      <request-condition-editor .condition="${condition}"></request-condition-editor>`));
  }

  describe('Model values initialization', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('enables the switch button', () => {
      const button = element.shadowRoot.querySelector('[name="condition.enabled"]');
      assert.isTrue(button.checked);
    });

    it('source input has value', () => {
      const input = element.shadowRoot.querySelector('[data-name="source"]');
      assert.equal(input.selected, 'request');
    });

    it('sourceType input has value', () => {
      const input = element.shadowRoot.querySelector('[data-name="sourceType"]');
      assert.equal(input.selected, 'body');
    });

    it('sourcePath input has value', () => {
      const input = element.shadowRoot.querySelector('[name="sourcePath"]');
      assert.equal(input.value, 'data');
    });

    it('operator input has value', () => {
      const input = element.shadowRoot.querySelector('[name="condition.operator"]');
      assert.equal(input.value, 'not-equal');
    });

    it('condition input has value', () => {
      const input = element.shadowRoot.querySelector('[name="condition.condition"]');
      assert.equal(input.value, 'test-condition');
    });
  });

  describe('changing values', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('changes "enabled" property', async () => {
      const button = element.shadowRoot.querySelector('[name="condition.enabled"]');
      const spy = sinon.spy();
      element.addEventListener('condition-changed', spy);
      MockInteractions.tap(button);
      assert.isTrue(spy.called, 'event was dispatched');
      assert.isFalse(spy.args[0][0].detail.value.enabled, 'event has updated value');
      assert.isFalse(element.condition.enabled, 'editor value is changed');
    });

    it('changes "source" property', async () => {
      const spy = sinon.spy();
      element.addEventListener('condition-changed', spy);
      const input = element.shadowRoot.querySelector('.source-main');
      const item = input.querySelector('[value="response"]');
      MockInteractions.tap(item);
      assert.isTrue(spy.called, 'event was dispatched');
      assert.equal(spy.args[0][0].detail.value.source, 'response.body.data', 'event has updated value');
      assert.equal(element.source, 'response', 'editor value is changed');
    });

    it('changes "sourceType" property', async () => {
      const spy = sinon.spy();
      element.addEventListener('condition-changed', spy);
      const input = element.shadowRoot.querySelector('.source-type');
      const item = input.querySelector('[value="url"]');
      MockInteractions.tap(item);
      assert.isTrue(spy.called, 'event was dispatched');
      assert.equal(spy.args[0][0].detail.value.source, 'request.url.data', 'event has updated value');
      assert.equal(element.sourceType, 'url', 'editor value is changed');
    });

    it('changes "sourcePath" property', async () => {
      const spy = sinon.spy();
      element.addEventListener('condition-changed', spy);
      const input = element.shadowRoot.querySelector('.source-path');
      input.value = 'other';
      assert.isTrue(spy.called, 'event was dispatched');
      assert.equal(spy.args[0][0].detail.value.source, 'request.body.other', 'event has updated value');
      assert.equal(element.sourcePath, 'other', 'editor value is changed');
    });

    it('changes "operator" property', async () => {
      const input = element.shadowRoot.querySelector('[name="condition.operator"]');
      const spy = sinon.spy();
      element.addEventListener('condition-changed', spy);
      const item = input.shadowRoot.querySelector('anypoint-item');
      MockInteractions.tap(item);
      assert.isTrue(spy.called, 'event was dispatched');
      assert.equal(spy.args[0][0].detail.value.operator, 'equal', 'event has updated value');
      assert.equal(element.condition.operator, 'equal', 'editor value is changed');
    });

    it('changes "condition" property', async () => {
      const spy = sinon.spy();
      element.addEventListener('condition-changed', spy);
      const input = element.shadowRoot.querySelector('.condition');
      input.value = 'other';
      assert.isTrue(spy.called, 'event was dispatched');
      assert.equal(spy.args[0][0].detail.value.condition, 'other', 'event has updated value');
      assert.equal(element.condition.condition, 'other', 'editor value is changed');
    });

    it('hiddes path field when changing selection to status code', async () => {
      const input = element.shadowRoot.querySelector('.source-type');
      const item = input.querySelector('[value="status"]');
      MockInteractions.tap(item);
      await nextFrame();
      const node = element.shadowRoot.querySelector('.source-path');
      assert.isTrue(node.hasAttribute('hidden'));
    });

    it('set condition input type to number for status code', async () => {
      const input = element.shadowRoot.querySelector('.source-type');
      const item = input.querySelector('[value="status"]');
      MockInteractions.tap(item);
      await nextFrame();
      const node = element.shadowRoot.querySelector('.condition');
      assert.equal(node.type, 'number');
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
