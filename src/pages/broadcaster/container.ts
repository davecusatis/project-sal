import { GlobalState } from '../../core/models/global-state';
import { isBroadcaster, getSession } from '../../core/reducers/session';
import { ReduxStateProps, BroadcasterConfigPageComponent, PublicProps, ReduxDispatchProps } from './component';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { titleReceived } from '../../core/actions/slot-machine';
import { getSlotMachineTitle } from '../../core/reducers/slot-machine';

function mapStateToProps(state: GlobalState): ReduxStateProps {
  return {
    session: getSession(state),
    isBroadcaster: isBroadcaster(state),
    title: getSlotMachineTitle(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    titleReceived: (title: string) => dispatch(titleReceived(title)),
  }
}

export const BroadcasterConfigPage = connect<ReduxStateProps, ReduxDispatchProps, PublicProps>(mapStateToProps, mapDispatchToProps)(BroadcasterConfigPageComponent);
