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
  addNewScore: (score: Score) => void;
}

type Props = PublicProps & ReduxStateProps & ReduxDispatchProps & RouteProps;
export class DashboardPageComponent extends React.Component<Props, State> {
  public componentDidMount() {
    window.Twitch.ext.listen('broadcast', (target: any, contentType: any, message: any) => {
      message = JSON.parse(message);
      switch (message.type) {
        case 'scoreUpdated':
          this.props.addNewScore(message.data.score);
          break;
        default:
          break;
      }
    });
  }
  public componentDidUpdate() {
    if (this.props.session && this.props.session.token && !this.props.scores) {
      console.log('setting scores');
      api.getAllScores(this.props.session.token)
        .then(resp => resp.json())
        .then(scores => this.props.setAllScores(scores));
    }
  }

  public render() {
    if (!this.props.isBroadcaster) {
      return null;
    }
    const scoreHTML = this.props.scores ? this.props.scores.map(score => {
      return (
        <div key={score.id}>
          {score.score} by {score.userId} on {score.channelId} with {score.bitsUsed} <br />
        </div>
      );
    }) : <>No scores yet!</>;

    const recentScores = this.props.scores ? this.props.scores.filter((score, index) => {
      return index >= this.props.scores.length - 3;
    }).map(score => {
      return (
        <div key={score.id}>
          {score.score} by {score.userId} on {score.channelId} with {score.bitsUsed} <br />
        </div>
      );
    }) : <>No scores yet!</>;

    return (
      <div>
        Most Recent Scores:
        <br />
        {recentScores}
        <br />
        <br />
        Scores This Session:
        <br />
        {scoreHTML}
      </div>
    );
  }
}
