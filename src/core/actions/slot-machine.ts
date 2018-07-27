import { Action } from '../models/actions';
import { API } from '../api';

const api = new API();

export const PLAY = 'core.slot-machine.PLAY';
interface playAction extends Action<typeof PLAY> { }

export const ERROR = 'core.slot-machine.ERROR';
interface errAction extends Action<typeof ERROR> { }

export const SCORE_RECEIVED = 'core.slot-machine.SCORE_RECEIVED';
interface scoreReceivedAction extends Action<typeof SCORE_RECEIVED> {
  score: number;
}

export type All = (
  | playAction
  | scoreReceivedAction
);

export function play(jwt: string): playAction {
  api.play(jwt);
  return {
    type: PLAY
  };
}

export function scoreUpdated(newScore: number): scoreReceivedAction {
  return {
    type: SCORE_RECEIVED,
    score: newScore,
  }
}
