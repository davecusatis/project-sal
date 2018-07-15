import { GlobalState } from "../../models/global-state";
import { getPlaylist } from "../../reducers/playlist";
import { getContext } from '../../reducers/context';
import { getSession } from '../../reducers/session';
import { ReduxStateProps, DashboardPageComponent, PublicProps } from './component';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

function mapStateToProps(state: GlobalState): ReduxStateProps {
    return {
      session: getSession(state)
    };
}

export const DashboardPage = connect<ReduxStateProps, null, PublicProps>(mapStateToProps)(DashboardPageComponent);
