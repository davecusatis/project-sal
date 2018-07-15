import * as React from 'react';
import { RouteComponentProps, Switch, Redirect } from 'react-router-dom';
import { Context } from '../../core/models/context';
import { Session } from '../../core/models/session';

interface State {
}
export interface PublicProps { }
export type RouteProps = RouteComponentProps<{}>;
export interface ReduxStateProps {
  context?: Context;
  session?: Session;
}

type Props = PublicProps & ReduxStateProps & RouteProps;
export class SlotMachinePageComponent extends React.Component<Props, State> {
  public render() {
    return (
      <></>
    );
  }
}
