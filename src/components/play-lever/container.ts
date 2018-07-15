import { GlobalState } from '../../core/models/global-state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { PlayLeverComponent, ReduxStateProps, ReduxDispatchProps } from './component';
import * as slotActions from '../../core/actions/slot-machine';
import { getSession } from '../../core/reducers/session';

function mapStateToProps(state: GlobalState): ReduxStateProps {
  return {
    session: getSession(state)
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    play: (jwt: string) => dispatch(slotActions.play(jwt)),
  }
}

export const PlayLever = connect<ReduxStateProps, ReduxDispatchProps>(mapStateToProps, mapDispatchToProps)(PlayLeverComponent);

