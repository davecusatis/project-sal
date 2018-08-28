import * as React from 'react';
import { Canvas } from '../canvas';
import { Score } from '../../core/models/slot-machine';

export interface PublicProps {
}

export interface ReduxStateProps {
  spinning: boolean;
  lastScore?: Score;
}

type Props = PublicProps & ReduxStateProps;
export class SlotMachineComponent extends React.Component<Props> {
  private renderSpinning(): JSX.Element {
    return (
      <div> Spinning </div>
    );
  }

  public render() {
    const { spinning, lastScore } = this.props;
    return (
      <div>
        <Canvas />
        <br />
        {spinning && this.renderSpinning()}
        Score: {lastScore && lastScore.score}
      </div>
    );
  }
}
