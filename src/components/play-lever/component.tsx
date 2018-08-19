import * as React from 'react';
import { Session } from '../../core/models/session';
import * as lever from '../../assets/img/lever.png';

export interface ReduxStateProps {
  session: Session;
}

export interface ReduxDispatchProps {
  play: (jwt: string) => void;
}

type Props = ReduxStateProps & ReduxDispatchProps;

export class PlayLeverComponent extends React.Component<Props> {
  public render() {
    const { play, session } = this.props;
    if (!session) {
      return null;
    }

    return (
      <>
        <button onClick={() => { play(session.token); }}>Play</button>
      </>
    );
  }
}
