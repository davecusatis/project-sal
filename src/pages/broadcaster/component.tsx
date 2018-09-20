import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { API } from '../../core/api';
import { Session } from '../../core/models/session';

const api = new API();

interface State { }

export interface PublicProps { }
export type RouteProps = RouteComponentProps<{}>;
export interface ReduxStateProps {
  session?: Session;
  isBroadcaster: boolean;
}


type Props = PublicProps & ReduxStateProps & RouteProps;
export class BroadcasterConfigPageComponent extends React.Component<Props, State> {

  public render() {
    if (!this.props.isBroadcaster) {
      return null;
    }

    return (
      <div>

      </div>
    );
  }
}
