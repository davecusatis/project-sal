import { GlobalState } from '../../core/models/global-state';
import { getSession } from '../../core/reducers/session';
import { ReduxStateProps, DashboardPageComponent, PublicProps } from './component';
import { connect } from 'react-redux';

function mapStateToProps(state: GlobalState): ReduxStateProps {
  return {
    session: getSession(state)
  };
}

export const DashboardPage = connect<ReduxStateProps, null, PublicProps>(mapStateToProps)(DashboardPageComponent);
