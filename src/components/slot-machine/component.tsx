import * as React from 'react';
import { Canvas } from '../canvas';

export interface PublicProps {
}

export interface ReduxStateProps {
  spinning: boolean;
  lastScore?: number;
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
        Score: {lastScore}
      </div>
    );
  }
}
