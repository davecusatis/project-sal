import { GlobalState } from "../../models/global-state";
import { getSonglist } from "../../reducers/songlist";
import { getContext } from '../../reducers/context';
import { getSession } from '../../reducers/session';
import { ReduxStateProps, BroadcasterConfigPageComponent, PublicProps } from './component';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

function mapStateToProps(state: GlobalState): ReduxStateProps {
    return {
      songlist: getSonglist(state),
      context: getContext(state),
      session: getSession(state)
    };
}

export const BroadcasterConfigPage = connect<ReduxStateProps, null, PublicProps>(mapStateToProps)(BroadcasterConfigPageComponent);
