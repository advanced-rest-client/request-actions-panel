/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   src/RequestConditionEditor.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {ActionBase} from './ActionBase.js';

import {html, css} from 'lit-element';

export {RequestConditionEditor};

declare namespace UiElements {

  /**
   * An editor for request / response editors.
   * It creates data model that is accetable in ARC elements ecosystem for conditions.
   *
   * ### Data model
   *
   * Condition data model is:
   *
   * ```javascript
   * {
   *   source: 'String', // See below for detailed description.
   *   operator: 'String', // see below for list of all operators
   *   condition: 'any' // value to use to compare the value get from the action `source` property
   * }
   * ```
   *
   * #### source
   *
   * Instructs the condition runner from where to take the value for the condition.
   * General structure is:
   *
   * ```
   * source object . data type [. path]
   * ```
   *
   * Source object can be either `request` or `response`.
   *
   * Data type describes type of the request / response data. Can be one of:
   *
   * - url - URL associated with the request / response
   * - status - Only for response data source object. Response's status code.
   * - header - Request / response headers
   * - body - Request / response body
   *
   * Path allows to instruct the runner from where specifically in the data type get the value.
   *
   * For `url` you can define the following properties:
   * - host - Returns the host value, e.g. `api.domain.com`
   * - protocol - Returns URL protocol, e.g. `https:`
   * - path - URL's path, e.g. `/path/to/resource.json`
   * - query - Returns full query string, e.g. `version=1&page=test`
   * - query.[any string] - Returns the value of a query parameter. For `query.version` it would return `1`
   * - hash - Returns everything that is after the `#` character, e.g. `access_token=token&state=A6RT7W`
   * - hast.[any string] - It treats hash as a query parameters and returns the value of the parameter.
   * For `hash.access_token` it would return `token`
   *
   * For `body` you can define path to the value for XML and JSON data only.
   * Any other content type will result with `undefined` value.
   *
   * #### operator
   *
   * Operator can be one of:
   * - equal
   * - not-equal
   * - greater-than
   * - greater-than-equal
   * - less-than
   * - less-than-equal
   * - contains
   *
   * Contains can operate on strings, simple arrays (e.g. `['test', 123]`) or objects (e.g. {'key':'value'}).
   *
   * ### Example
   *
   * ```javascript
   * const config = {
   *   source: 'request.body.items.0.name',
   *   action: 'assign-variable',
   *   destination: 'someValue',
   *   conditions: [{
   *     source: 'response.status',
   *     operator: 'equal',
   *     condition: 200
   *   }]
   * }
   * ```
   */
  class RequestConditionEditor extends ActionBase {
    readonly _pathHidden: any;

    /**
     * Definied condition.
     */
    condition: object|null|undefined;
    readonly conditionInputType: any;

    /**
     * Value computed from the `action.source` property.
     * Binded to source input field.
     */
    source: string|null|undefined;

    /**
     * Value computed from the `action.source` property.
     * Binded to source type input field.
     */
    sourceType: string|null|undefined;

    /**
     * Value computed from the `action.source` property.
     * Binded to path input field.
     */
    sourcePath: string|null|undefined;
    constructor();
    render(): any;

    /**
     * Clears the path info.
     */
    clear(): void;
    _conditionChanged(condition: any): void;
  }
}
