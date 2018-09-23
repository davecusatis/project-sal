import * as slotMachineActions from '../actions/slot-machine';
import { GlobalState } from '../models/global-state';
import { Score } from '../models/slot-machine';

export interface SlotMachineState {
  spinning: boolean;
  lastScore?: Score;
  scores?: Score[];
  slotMachineTitle?: string;
}

export const getInitialState = (): SlotMachineState => ({
  spinning: false,
});

export function slotMachineReducer(state = getInitialState(), action: slotMachineActions.All): SlotMachineState {
  switch (action.type) {
    case slotMachineActions.PLAY:
      return {
        ...state,
        spinning: true,
      };
    case slotMachineActions.SCORE_RECEIVED:
      return {
        ...state,
        scores: [...state.scores, action.score],
        lastScore: action.score,
      };
    case slotMachineActions.TITLE_RECEIVED:
      return {
        ...state,
        slotMachineTitle: action.title,
      };
    case slotMachineActions.SET_ALL_SCORES:
      return {
        ...state,
        spinning: false,
        scores: action.scores,
      };
    default:
      return state;
  }
}

export function getLastScore(state: GlobalState): Score {
  return state.slotMachine && state.slotMachine.lastScore;
}

export function spinning(state: GlobalState): boolean {
  return state.slotMachine && state.slotMachine.spinning;
}

export function getAllScores(state: GlobalState): Score[] {
  return state.slotMachine && state.slotMachine.scores;
}

export function getSlotMachineTitle(state: GlobalState): string {
  return state.slotMachine && state.slotMachine.slotMachineTitle;
}
