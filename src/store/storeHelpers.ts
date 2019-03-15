import { Reducer, Action, AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import AppState from 'store/AppState'

export type Dispatch = ThunkDispatch<AppState, null, AnyAction>

export interface AsyncAction<TStart, TSuccess, TError> {
  start: TStart & Action
  success: TSuccess & Action
  error: TError & Action
}

export interface AsyncActionCreator {
  start: any,
  success: any,
  error: any,
}

type HandlerFunction<TState> = (action: Action) => TState
interface HandlerFunctionsMap<TState> {
  [key: string]: HandlerFunction<TState>
}
export type StateToHandlerFunctionsMap<TState> = (state?: TState) => HandlerFunctionsMap<TState>

export function createReducers<TState>(
  initialState: TState,
  handlerFunctionMaps: StateToHandlerFunctionsMap<TState> | Array<StateToHandlerFunctionsMap<TState>>,
): Reducer<TState> {
  return function reducer(state: TState = initialState, action: Action) {
    let handlers

    if (Array.isArray(handlerFunctionMaps)) {
      handlers = handlerFunctionMaps.reduce((result, handlerFunctionMap) => {
        return {
          ...result,
          ...handlerFunctionMap(state),
        }
      }, {})
    } else {
      handlers = handlerFunctionMaps(state)
    }

    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](action)
    } else {
      return state
    }
  }
}
