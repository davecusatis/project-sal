import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Score } from '../../core/models/slot-machine';
import { API } from '../../core/api';
import { Session } from '../../core/models/session';

const api = new API();

interface State { }

export interface PublicProps { }
export type RouteProps = RouteComponentProps<{}>;
export interface ReduxStateProps {
  session?: Session;
  isBroadcaster: boolean;
  scores: Score[];
}

export interface ReduxDispatchProps {
  setAllScores: (scores: Score[]) => void;
}

type Props = PublicProps & ReduxStateProps & ReduxDispatchProps & RouteProps;
export class DashboardPageComponent extends React.Component<Props, State> {
  public componentDidMount() {
    if (this.props.isBroadcaster && !this.props.scores) {
      api.getAllScores(this.props.session.token)
        .then(resp => resp.json())
        .then(scores => this.props.setAllScores(scores));
    }
  }

  public render() {
    if (!this.props.isBroadcaster) {
      return null;
    }

    const { scores } = this.props;
    const scoreHTML = scores ? scores.map(score => {
      <>
        {score.score} by {score.userId} on {score.channelId} with {score.bitsUsed}
      </>
    }) : <>No scores yet!</>;

    return (
      <div>
        Most Recent Scores:
        <br />
        {scoreHTML}
        <br />

        <br />
        Scores This Session:
        <br />
        {scoreHTML}
      </div>
    );
  }
}
