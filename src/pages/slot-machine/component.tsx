import * as React from 'react';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { Context } from '../../core/models/context';
import { Session } from '../../core/models/session';
import { Canvas } from '../../components/canvas';
import { API } from '../../core/api';
import { Score } from '../../core/models/slot-machine';

const api = new API();

interface State {
}
export interface PublicProps { }
export type RouteProps = RouteComponentProps<{}>;
export interface ReduxStateProps {
  context?: Context;
  session?: Session;
  scores: Score[];
}

export interface ReduxDispatchProps {
  setAllScores: (scores: Score[]) => void;
}

type Props = PublicProps & ReduxStateProps & ReduxDispatchProps & RouteProps;
export class SlotMachinePageComponent extends React.Component<Props, State> {
  public componentDidUpdate() {
    if (this.props.session && this.props.session.token && !this.props.scores) {
      api.getAllScores(this.props.session.token)
        .then(resp => resp.json())
        .then(scores => this.props.setAllScores(scores));
    }
  }

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
