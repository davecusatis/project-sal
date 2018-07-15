import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Session } from '../../core/models/session';

interface State { }
export interface PublicProps { }
export type RouteProps = RouteComponentProps<{}>;
export interface ReduxStateProps {
  session?: Session;
}

type Props = PublicProps & ReduxStateProps & RouteProps;
export class DashboardPageComponent extends React.Component<Props, State> {
  public render() {
    return (
      <div className='dashboard-config-container'>
        Live config
      </div>
    );
  }
}
