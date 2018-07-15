import { Context } from '../models/context';
import * as contextActions from '../actions/context';
import { GlobalState } from '../models/global-state';

export interface ContextState {
  contextReceived: boolean;
  context?: Context;
}

export const getInitialState = (): ContextState => ({
  contextReceived: false,
});

export function contextReducer(state = getInitialState(), action: contextActions.All): ContextState {
  switch(action.type) {
    case contextActions.ON_CONTEXT:
      return {
        ...state,
        contextReceived: true,
        context: action.context,
      };
    default:
      return state;
  }
}

export function getContext(state: GlobalState): Context {
  return state.context && state.context.context;
}
