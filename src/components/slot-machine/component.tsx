import * as React from 'react';
import { PlayLever } from '../play-lever';

export interface PublicProps {
}

export interface ReduxStateProps {
  spinning: boolean;
  lastScore?: number;
}

type Props = PublicProps & ReduxStateProps;
export class SlotMachineComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  private renderSpinning(): JSX.Element {
    return (
      <div> Spinning </div>
    );
  }

  public render() {
    const { spinning, lastScore } = this.props;
    return (
      <div>
        <PlayLever />
        {spinning && this.renderSpinning()}
        {lastScore}
      </div>
    );
  }
}
