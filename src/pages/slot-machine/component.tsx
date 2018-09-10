import * as React from 'react';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { Context } from '../../core/models/context';
import { Session } from '../../core/models/session';
import { Canvas } from '../../components/canvas';
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
    const { context } = this.props;
    if (context && context.mode === "config") {
      return (<Redirect to='/config' />);
    }

    if (context && context.mode === "dashboard") {
      return (<Redirect to='/dashboard' />);
    }

    return (
      <div>
        <Canvas />
      </div>
    );
  }
}
