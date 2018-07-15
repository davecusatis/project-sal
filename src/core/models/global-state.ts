import { ContextState } from '../reducers/context';
import { SessionState } from '../reducers/session';
import { SlotMachineState } from '../reducers/slot-machine';

export interface GlobalState {
  context: ContextState;
  session: SessionState;
  slotMachine: SlotMachineState;
}
