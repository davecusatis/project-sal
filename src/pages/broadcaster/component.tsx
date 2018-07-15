import * as React from 'react';
import { RouteComponentProps, Switch, Redirect} from 'react-router-dom';
import { Song } from '../../models/song';
import { Header } from '../../components/header';
import { Context } from '../../models/context';
import { Session } from '../../models/session';
import { SonglistInput } from '../../components/songlist-input';
import { app }  from '../../app/app';
import * as songlistActions from '../../actions/songlist';

interface State {
  songlist: Song[];
}
export interface PublicProps {}
export type RouteProps = RouteComponentProps<{}>;
export interface ReduxStateProps {
  songlist?: Song[];
  context?: Context;
  session?: Session;
}

type Props = PublicProps & ReduxStateProps & RouteProps;
export class BroadcasterConfigPageComponent extends React.Component<Props, State> {
  public render() {
    const { session, songlist } = this.props;
    const channel = session && session.channelId;
    if (songlist === undefined) {
      return null;
    }
    return (
      <div>
        Broadcaster Config
        <SonglistInput
          onSubmit={(songlist: Song[]) => {
            app.store.dispatch(songlistActions.saveSonglist(session.token, songlist));
          }} />
      </div>
    );
  }
}
