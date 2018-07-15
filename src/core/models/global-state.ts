import { ContextState } from '../reducers/context';
import { SessionState } from '../reducers/session';

export interface GlobalState {
  context: ContextState;
  session: SessionState;
}
