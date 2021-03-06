/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   src/RequestActionEditor.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {ActionBase} from './ActionBase.js';

import {html, css} from 'lit-element';

export {RequestActionEditor};

declare namespace UiElements {

  /**
   * Request action editor. Allows to build data model for request action using convinient UI.
   *
   * ## Element use example
   *
   * ```
   * <request-action-editor action="{{action}}" opened></request-action-editor>
   * ```
   */
  class RequestActionEditor extends ActionBase {
    readonly actionStateLabel: any;
    readonly actionLabel: any;
    readonly togglePanelLabel: any;
    readonly _pathHidden: any;
    readonly iteratorStatusLabel: any;
    readonly _renderIterator: boolean|null|undefined;

    /**
     * Definied action.
     */
    action: object|null|undefined;

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

    /**
     * List of variables sugesstions to display in the combo box.
     */
    variablesSuggestions: any[]|null|undefined;

    /**
     * True to open the editor view.
     */
    opened: boolean|null|undefined;
    constructor();
    render(): any;

    /**
     * Clears the path info.
     */
    clear(): void;
    _actionChanged(action: any): void;

    /**
     * Handler for add condition button click.
     */
    _appendCondition(): void;

    /**
     * Adds a condition to conditions list.
     *
     * @param opts Optional model properties for the condition.
     */
    addCondition(opts: object|null): void;

    /**
     * Handles delete of the condition.
     */
    _removeCondition(e: CustomEvent|null): void;

    /**
     * Toggles opened state of the editor.
     */
    toggleOpened(): void;
    _iteratorChanged(e: any): void;
    _headerTemplate(): any;
    _actionTemplate(): any;
    _variableTemplate(): any;
    _conditionsTemplate(): any;
    _actionsTemplate(): any;
    _iteratorTemplate(): any;
    _formTemplate(): any;
  }
}
