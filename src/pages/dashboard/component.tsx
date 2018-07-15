import * as React from 'react';
import { RouteComponentProps, Switch, Redirect} from 'react-router-dom';
import { Song } from '../../models/song';
import { Header } from '../../components/header';
import { Context } from '../../models/context';
import { Session } from '../../models/session';
import { Playlist } from '../../components/playlist/container';
import { app } from '../../app/app';
import * as playlistActions from '../../actions/playlist';

interface State {}
export interface PublicProps {}
export type RouteProps = RouteComponentProps<{}>;
export interface ReduxStateProps {
  session?: Session;
}

type Props = PublicProps & ReduxStateProps & RouteProps;
export class DashboardPageComponent extends React.Component<Props, State> {
  public render() {
    const { session } = this.props;
    const channel = session && session.channelId;

    return (
      <div className='dashboard-config-container'>
        Manage Playlist
        <div>
          <button onClick={(event: React.MouseEvent<HTMLElement>) => { this.skipSong(session.token)}}>Skip Song</button>
        </div>
        <Playlist
          editable={true}
          channel={channel}
          deleteSong={(song: Song) => this.deleteSong(song)}/>
      </div>
    );
  }

  private skipSong(token: string){
    app.store.dispatch(playlistActions.skipSong(token));
  }

  private deleteSong(song: Song){
    const { session } = this.props;
    app.store.dispatch(playlistActions.deleteSong(session.token, song));
  }
}
