import { GlobalState } from "../../core/models/global-state";
import { linkIdentity } from '../../core/actions/session';
import { isLinkedAccount } from '../../core/reducers/session';
import { ReduxStateProps, RootComponent, PublicProps, ReduxDispatchProps } from './component';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { withRouter } from 'react-router';
import { Twitch } from '../../core/models/twitch';

function mapStateToProps(state: GlobalState): ReduxStateProps {
  return {
    isLinked: isLinkedAccount(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    linkIdentity: (twitch: Twitch) => dispatch(linkIdentity(twitch)),
  }
}

const connectedComponent = connect<ReduxStateProps, ReduxDispatchProps, PublicProps>(mapStateToProps, mapDispatchToProps)(RootComponent);
export const Root: React.ComponentClass<PublicProps> = withRouter(connectedComponent);
