import { GlobalState } from '../../core/models/global-state';
import { getContext } from '../../core/reducers/context';
import { getSession } from '../../core/reducers/session';
import { ReduxStateProps, SlotMachinePageComponent, PublicProps, ReduxDispatchProps } from './component';
import { connect } from 'react-redux';
import { getAllScores } from '../../core/reducers/slot-machine';
import { Dispatch } from 'redux';
import { Score } from '../../core/models/slot-machine';
import { setAllScores } from '../../core/actions/slot-machine';

function mapStateToProps(state: GlobalState): ReduxStateProps {
  return {
    context: getContext(state),
    session: getSession(state),
    scores: getAllScores(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setAllScores: (scores: Score[]) => dispatch(setAllScores(scores)),
  }
}
export const SlotMachinePage = connect<ReduxStateProps, ReduxDispatchProps, PublicProps>(mapStateToProps, mapDispatchToProps)(SlotMachinePageComponent);
