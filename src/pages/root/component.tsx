import * as React from 'react';
import * as classNames from 'classnames';
import { RouteComponentProps, Switch, Redirect } from 'react-router-dom';
import { renderRoutes } from '../routes';
import { Twitch } from '../../core/models/twitch';
import { linkIdentitySession } from '../../core/actions/session';
import './component.scss';

interface State {
  open: boolean;
}
export interface PublicProps { }
export type RouteProps = RouteComponentProps<{}>;
export interface ReduxStateProps {
  isLinked: boolean;
}

export interface ReduxDispatchProps {
  linkIdentity: (twitch: Twitch) => linkIdentitySession;
}

type Props = PublicProps & ReduxStateProps & RouteProps & ReduxDispatchProps;

export class RootComponent extends React.Component<Props, State> {
  private renderApp(rootContainerClasses: string): JSX.Element {
    return (
      <>
        <div className={rootContainerClasses}>
          <Switch>
            {renderRoutes()}
          </Switch>
        </div>
      </>
    );
  }

  public render() {
    const rootContainerClasses = classNames({
      'app-root-container': true
    })
    return (
      <div>
        {this.renderApp(rootContainerClasses)}
      </div>
    );
  }
}
