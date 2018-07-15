import { GlobalState } from '../../core/models/global-state';
import { ReduxStateProps, SlotMachineComponent, PublicProps } from './component';
import { connect } from 'react-redux';
import { spinning, getLastScore } from '../../core/reducers/slot-machine';

function mapStateToProps(state: GlobalState): ReduxStateProps {
  return {
    spinning: spinning(state),
    lastScore: getLastScore(state)
  };
}

export const SlotMachine = connect<ReduxStateProps, null, PublicProps>(mapStateToProps)(SlotMachineComponent);
