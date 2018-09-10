import { GlobalState } from '../../core/models/global-state';
import { isBroadcaster, getSession } from '../../core/reducers/session';
import { ReduxStateProps, BroadcasterConfigPageComponent, PublicProps } from './component';
import { connect } from 'react-redux';

function mapStateToProps(state: GlobalState): ReduxStateProps {
  return {
    session: getSession(state),
    isBroadcaster: isBroadcaster(state),
  };
}


export const BroadcasterConfigPage = connect<ReduxStateProps, null, PublicProps>(mapStateToProps)(BroadcasterConfigPageComponent);
