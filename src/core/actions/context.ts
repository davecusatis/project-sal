import { Action } from '../models/actions';
import { Context } from '../models/context';

export const ON_CONTEXT = 'core.onContext';

interface onContextAction extends Action<typeof ON_CONTEXT> {
  context: Context;
}

export type All = (
  | onContextAction
);

export function onContext(context: Context): onContextAction {
  return {
    type: ON_CONTEXT,
    context
  };
}
