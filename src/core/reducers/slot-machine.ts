import * as slotMachineActions from '../actions/slot-machine';
import { GlobalState } from '../models/global-state';

export interface SlotMachineState {
  spinning: boolean;
  lastScore?: number;
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
        spinning: false,
        lastScore: action.score,
      };
    default:
      return state;
  }
}

export function getLastScore(state: GlobalState): number {
  return state.slotMachine && state.slotMachine.lastScore;
}

export function spinning(state: GlobalState): boolean {
  return state.slotMachine && state.slotMachine.spinning;
}
