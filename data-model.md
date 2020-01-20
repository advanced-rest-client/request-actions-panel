## beforeActions property

Request actions are called before a request is executed. The request logic waits until all actions are executed and then executes the request.

Type: Array<Action>

## afterActions property

After actions are called after the response is ready.
Response actions are executed asynchronously to the response reporting.

Type: Array<Action>

## Action

Defines base class for a request actions. This structure is extended by request action implementations.

```yaml
type:
  description: |
    A type of the action. Used by processors to determine which processor should run the action.
  type: string
  enum: [request, response]
  required: true
name:
  description: |
    The name of the action. It is used to recognize which action is being executed.
    For example the action of a type of `request` can be a `set-variable` action that
    sets a variable in the application.
  type: string
  required: true
  pattern: [a-zA-Z0-9]*
  example: "set-cookie"
enabled:
  description: |
    Action enabled state.
  required: false
  default: true
  type: boolean
priority:
  description: |
    Defines action priority on scale from 1 to 10.
    The default is 5. The lower number the higher priority.

    Note, ARC has priority 0 which is reserved for variables processing only
    as it must run before any action is executed.
    Actions cannot set variables on the request object as after actions are executed
    the variables evaluator do not run.
  type: number
  minimum: 1
  maximum: 10
  default: 5
  required: false
config:
  type: object|array
  required: true
  description: |
    The configuration of the action. Each action has it's own structure.
    Check action's component documentation for details.

    Note, actions without configuration are ignored.
async:
  type: boolean
  default: false
  description: |
    Informs the processors whether the action should be processed synchronously
    or asynchronously.
    It is not related to language sync/async processing as all actions are executed asynchronously.
    This flag informs whether a general flow of the request should wait until the action finish execution or not.

    An example of async action is storing request data in history. The request can be reported
    without waiting to commit data to the data store.
throws:
  type: boolean
  default: false
  description: |
    Describes whether or not the action resulted in error should stop execution of the request flow.
```
