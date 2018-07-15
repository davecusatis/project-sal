import { Session } from '../models/session'
import * as sessionActions from '../actions/session';
import { GlobalState } from '../models/global-state';

export interface SessionState {
  sessionReceived: boolean;
  session?: Session;
}

export const getInitialState = (): SessionState => ({
  sessionReceived: false,
});

export function sessionReducer(state = getInitialState(), action: sessionActions.All): SessionState {
  switch(action.type) {
    case sessionActions.ON_AUTHORIZED:
      return {
        ...state,
        sessionReceived: true,
        session: action.session,
      };
    default:
      return state;
  }
}

export function getSession(state: GlobalState): Session {
  return state.session && state.session.session;
}

export function isLinkedAccount(state: GlobalState): boolean {
  if(!(state.session && state.session.session)) {
    return false;
  }

  const tokenPayload = JSON.parse(atob(state.session.session.token.split('.')[1]));
  return 'user_id' in tokenPayload;
}
