import { Action } from '../models/actions';
import { API } from '../api';
import { Score } from '../models/slot-machine';

const api = new API();

export const PLAY = 'core.slot-machine.PLAY';
interface playAction extends Action<typeof PLAY> { }

export const SET_ALL_SCORES = 'core.slot-machine.SET_ALL_SCORES';
interface setAllScoresAction extends Action<typeof SET_ALL_SCORES> {
  scores: Score[];
}

export const SCORE_RECEIVED = 'core.slot-machine.SCORE_RECEIVED';
interface scoreReceivedAction extends Action<typeof SCORE_RECEIVED> {
  score: Score;
}

export const TITLE_RECEIVED = 'core.slot-machine.TITLE_RECEIVED';
interface titleReceivedAction extends Action<typeof TITLE_RECEIVED> {
  title: string;
}

export type All = (
  | playAction
  | scoreReceivedAction
  | setAllScoresAction
  | titleReceivedAction
);

export function play(jwt: string): playAction {
  api.play(jwt);
  return {
    type: PLAY
  };
}

export function scoreUpdated(newScore: Score): scoreReceivedAction {
  return {
    type: SCORE_RECEIVED,
    score: newScore,
  }
}

export function setAllScores(scores: Score[]): setAllScoresAction {
  return {
    type: SET_ALL_SCORES,
    scores: scores,
  }
}

export function titleReceived(title: string): titleReceivedAction {
  return {
    type: TITLE_RECEIVED,
    title: title,
  };
}
