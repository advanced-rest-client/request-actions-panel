import { fixture, assert, html, nextFrame } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import '../request-action-editor.js';

describe('<request-action-editor>', function() {
  async function basicFixture(action) {
    return (await fixture(html`
      <request-action-editor .action="${action}" opened></request-action-editor>`));
  }

  describe('initialization', () => {
    it('can be initalized without the action', async () => {
      await basicFixture();
    });

    it('sets _changeProperty', async () => {
      const element = await basicFixture();
      assert.equal(element._changeProperty, 'action');
    });
  });

  describe('Model values initialization', () => {
    let model;
    let element;
    beforeEach(async () => {
      model = {
        source: 'response.body.data',
        action: 'assign-variable',
        destination: 'test-war',
        enabled: true,
        conditions: [
          {
            source: 'response.status',
            operator: 'equal',
            condition: 200,
            enabled: true
          }
        ],
        hasIterator: true,
        iterator: {
          source: 'data.*.property',
          operator: 'equal',
          condition: ''
        }
      };
      element = await basicFixture(model);
    });

    it('enables the switch button', () => {
      const button = element.shadowRoot.querySelector('[name="action.enabled"]');
      assert.isTrue(button.checked);
    });

    it('source input has value', () => {
      const input = element.shadowRoot.querySelector('[data-name="source"]');
      assert.equal(input.selected, 'response');
    });

    it('sourceType input has value', () => {
      const input = element.shadowRoot.querySelector('[data-name="sourceType"]');
      assert.equal(input.selected, 'body');
    });

    it('sourcePath input has value', () => {
      const input = element.shadowRoot.querySelector('[name="sourcePath"]');
      assert.equal(input.value, 'data');
    });

    it('action input has value', () => {
      const input = element.shadowRoot.querySelector('[data-name="action.action"]');
      assert.equal(input.selected, 'assign-variable');
    });

    it('destination input has value', () => {
      const input = element.shadowRoot.querySelector('[name="action.destination"]');
      assert.equal(input.value, 'test-war');
    });

    it('renders single condition editor', () => {
      const nodes = element.shadowRoot.querySelectorAll('request-condition-editor');
      assert.lengthOf(nodes, 1);
    });

    it('condition editor has model set', () => {
      const node = element.shadowRoot.querySelector('request-condition-editor');
      assert.deepEqual(node.condition, model.conditions[0]);
    });

    it('renders iterator editor', () => {
      const node = element.shadowRoot.querySelector('request-action-iterator-editor');
      assert.ok(node);
    });

    it('sets model on iterator editor', () => {
      const node = element.shadowRoot.querySelector('request-action-iterator-editor');
      assert.deepEqual(node.iterator, model.iterator);
    });
  });

  describe('Conditions list manipulation', () => {
    let model;
    let element;
    beforeEach(async () => {
      model = {
        source: 'response.body.data',
        action: 'assign-variable',
        destination: 'test-war',
        enabled: true,
        conditions: [
          {
            source: 'response.status',
            operator: 'equal',
            condition: 200,
            enabled: true
          }
        ]
      };
      element = await basicFixture(model);
    });

    it('adds a codition', () => {
      const node = element.shadowRoot.querySelector('.add-condition');
      MockInteractions.tap(node);
      assert.lengthOf(element.action.conditions, 2);
    });

    it('dispatches remove event to removes an action', () => {
      const spy = sinon.spy();
      element.addEventListener('remove', spy);
      const node = element.shadowRoot.querySelector('.remove-action');
      MockInteractions.tap(node);
      assert.isTrue(spy.called, 'event was dispatched');
    });

    it('hides the list', () => {
      const node = element.shadowRoot.querySelector('.toggle-editor');
      MockInteractions.tap(node);
      assert.isFalse(element.opened);
    });

    it('removes a condition', () => {
      const node = element.shadowRoot.querySelector('request-condition-editor');
      node.dispatchEvent(new CustomEvent('remove'));
      assert.lengthOf(element.action.conditions, 0);
    });
  });

  describe('Iterator', () => {
    let element;
    let model;
    beforeEach(async () => {
      model = {
        source: 'response.body.data',
        action: 'assign-variable',
        destination: 'test-war',
        enabled: true,
      };
      element = await basicFixture(model);
    });

    it('enables iterator', async () => {
      const node = element.shadowRoot.querySelector('[data-action=iterable-toggle]');
      MockInteractions.tap(node);
      await nextFrame();
      const iterator = element.shadowRoot.querySelector('request-action-iterator-editor');
      assert.ok(iterator);
    });

    it('adds default value', () => {
      const node = element.shadowRoot.querySelector('[data-action=iterable-toggle]');
      MockInteractions.tap(node);
      assert.deepEqual(element.action.iterator, {
        source: 'data.*.property',
        operator: 'equal',
        condition: ''
      });
    });
  });

  describe('a11y', () => {
    const model = {
      source: 'response.body.data',
      action: 'assign-variable',
      destination: 'test-war',
      enabled: true,
      conditions: [
        {
          source: 'response.status',
          operator: 'equal',
          condition: 200,
          enabled: true
        }
      ],
      hasIterator: true,
      iterator: {
        source: 'data.*.property',
        operator: 'equal',
        condition: ''
      }
    };
    it('is accessible', async () => {
      const element = await basicFixture(model);
      await assert.isAccessible(element);
    });
  });
});
