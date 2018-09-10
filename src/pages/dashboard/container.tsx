import { GlobalState } from '../../core/models/global-state';
import { isBroadcaster, getSession } from '../../core/reducers/session';
import { ReduxStateProps, DashboardPageComponent, PublicProps } from './component';
import { connect } from 'react-redux';
import { getAllScores } from '../../core/reducers/slot-machine';
import { Dispatch } from 'redux';
import { Score } from '../../core/models/slot-machine';
import { setAllScores, scoreUpdated } from '../../core/actions/slot-machine';
import { ReduxDispatchProps } from './component';

function mapStateToProps(state: GlobalState): ReduxStateProps {
  return {
    session: getSession(state),
    isBroadcaster: isBroadcaster(state),
    scores: getAllScores(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setAllScores: (scores: Score[]) => dispatch(setAllScores(scores)),
    addNewScore: (score: Score) => dispatch(scoreUpdated(score)),
  }
}

export const DashboardPage = connect<ReduxStateProps, ReduxDispatchProps, PublicProps>(mapStateToProps, mapDispatchToProps)(DashboardPageComponent);
