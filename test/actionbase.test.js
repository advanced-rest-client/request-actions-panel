import { fixture, assert, html } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import '../request-condition-editor.js';

describe('ActionBase', function() {
  async function basicFixture() {
    return (await fixture(html`<request-condition-editor></request-condition-editor>`));
  }

  describe('_processSource()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets properties', () => {
      element._processSource('a.b.c');
      assert.equal(element.source, 'a', 'source is set');
      assert.equal(element.sourceType, 'b', 'sourceType is set');
      assert.equal(element.sourcePath, 'c', 'sourcePath is set');
    });

    it('sets default values', () => {
      element._processSource();
      assert.equal(element.source, '', 'source is set');
      assert.equal(element.sourceType, '', 'sourceType is set');
      assert.equal(element.sourcePath, '', 'sourcePath is set');
    });
  });

  describe('_computeSourcePath()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets empty string when no properties', () => {
      element._computeSourcePath();
      assert.equal(element.condition.source, '');
    });

    it('adds source part', () => {
      element.source = 'test';
      element._computeSourcePath();
      assert.equal(element.condition.source, 'test');
    });

    it('adds sourceType part', () => {
      element.source = 'test';
      element.sourceType = 'type';
      element._computeSourcePath();
      assert.equal(element.condition.source, 'test.type');
    });

    it('adds sourcePath part', () => {
      element.source = 'test';
      element.sourceType = 'type';
      element.sourcePath = 'path';
      element._computeSourcePath();
      assert.equal(element.condition.source, 'test.type.path');
    });

    it('updates existing value', () => {
      element.condition = {
        enabled: true,
        source: 'request.body.data',
        operator: 'not-equal',
        condition: 'test-condition'
      };
      element.sourcePath = 'path';
      element._computeSourcePath();
      assert.equal(element.condition.source, 'request.body.path');
    });

    it('dispatches change event', () => {
      const spy = sinon.spy();
      element.addEventListener('condition-changed', spy);
      element._computeSourcePath();
      assert.isTrue(spy.called, 'event was dispatched');
    });
  });

  describe('_propertyName()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns the argument when no _changeProperty', () => {
      element._changeProperty = undefined;
      const result = element._propertyName('test');
      assert.equal(result, 'test');
    });

    it('returns the argument when no path defined', () => {
      const result = element._propertyName('test');
      assert.equal(result, 'test');
    });

    it('returns the processed property name', () => {
      const result = element._propertyName('condition.test');
      assert.equal(result, 'test');
    });

    it('returns un-processed property when does not match _changeProperty', () => {
      const result = element._propertyName('source.test');
      assert.equal(result, 'source.test');
    });
  });
});
