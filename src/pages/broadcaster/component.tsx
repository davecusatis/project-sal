import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { API } from '../../core/api';
import { Session } from '../../core/models/session';
import { ImageUploader } from '../../components/image-uploader';
import * as bar from '../../assets/img/iconBar.png';
import * as bell from '../../assets/img/iconBell.png';
import * as cherries from '../../assets/img/iconCherries.png';
import * as coin from '../../assets/img/iconCoin.png';
import * as horseshoe from '../../assets/img/iconHorseshoe.png';
import * as lime from '../../assets/img/iconLime.png';
import * as plum from '../../assets/img/iconPlum.png';
import * as seven from '../../assets/img/iconSeven.png';
import * as diamond from '../../assets/img/iconDiamond.png';
import './component.scss';

const api = new API();

interface State {
  slotMachineTitle: string;
  saveError: string;
  saveSuccess: string;
}

export interface PublicProps { }
export type RouteProps = RouteComponentProps<{}>;
export interface ReduxStateProps {
  session?: Session;
  isBroadcaster: boolean;
  title: string;
}

export interface ReduxDispatchProps {
  titleReceived: (title: string) => void;
}

type Props = PublicProps & ReduxStateProps & RouteProps & ReduxDispatchProps;
export class BroadcasterConfigPageComponent extends React.Component<Props, State> {
  state: State = {
    slotMachineTitle: '',
    saveError: '',
    saveSuccess: '',
  };

  imageFormRef = React.createRef<HTMLFormElement>();

  public componentDidUpdate() {
    if (this.props.session && this.props.session.channelId && !this.props.title && !this.state.slotMachineTitle) {
      api.fetchSlotMachineTitle(this.props.session.channelId)
        .then(value => {
          if (!value.ok) {
            return null;
          }
          return value.text()
        })
        .then(title => {
          if (title) {
            this.props.titleReceived(title.trim());
            this.setState({
              slotMachineTitle: title,
            });
          }
        })
        .catch(err => console.log(err));
    }
  }

  private onSubmitSlotName(event: React.FormEvent<HTMLFormElement>) {
    const { token, channelId } = this.props.session;
    const { slotMachineTitle } = this.state;
    event.preventDefault();
    api.saveSlotMachineTitle(token, channelId, slotMachineTitle);
    this.setState({
      saveSuccess: 'Successfully saved slot machine title.',
    });
  }

  private onSubmitImages(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(this.imageFormRef.current);
    const { token, channelId } = this.props.session;
    api.saveUserImages(token, channelId, new FormData(this.imageFormRef.current))
      .catch(err => this.setState({
        saveError: 'Unable to save images.',
      }));
    this.setState({
      saveSuccess: 'Successfully saved images.',
    });
  }

  public render() {
    if (!this.props.isBroadcaster) {
      return null;
    }
    const { saveSuccess, saveError } = this.state;
    return (
      <div className='broadcaster-page' >
        <div className='slot-machine-title-container'>
          <div>Lucky Leaderboard Configuration</div>
          <div>Customize your slot machine! Upload your own images, sounds, and change the title of your slot machine. Please give it a few minutes after submiting your customizations for it to become active in your channel.</div>
          <div>Customize the title of your slot machine</div>
          <div className='slot-machine-title-form'>
            <form onSubmit={e => this.onSubmitSlotName(e)} >
              <input
                placeholder='Lucky Leaderboard'
                value={this.state.slotMachineTitle}
                onChange={(e) => this.setState({ slotMachineTitle: e.currentTarget.value })}>
              </input>
              <button className='broadcaster-button save-title'>Save Title</button>
              {saveSuccess &&
                <div>
                  {saveSuccess}
                </div>}
              {saveError &&
                <div>
                  {saveError}
                </div>}
            </form>
          </div>
        </div>
        <div className='broadcaster-divider' />
        <div className='uploads'>
          <div>
            Upload Custom Slot Images:
          <ul>
              <li>Images will be transformed to be square, and won't look great if you upload a rectangular image.</li>
              <li>Images dimensions must be no greater than 128px by 128px.</li>
              <li>Images must be less than 25kb.</li>
              <li>Accepted image formats are PNG, JPG, and JPEG only.</li>
              <li>Image uploads should adhere to the <a href='https://help.twitch.tv/customer/en/portal/articles/2348985-partner-emoticon-and-badge-guide#guidelines'>Twitch's Subscriber Badge and Emoticon Guidelines</a>.</li>
              <li>For general image upload concerns refer to: <a href='https://help.twitch.tv/customer/en/portal/articles/2348985-partner-emoticon-and-badge-guide#create'>Twitch's Subscriber Emoticon Guide </a>.</li>
            </ul>
          </div>
          <form ref={this.imageFormRef} onSubmit={e => this.onSubmitImages(e)} >
            <div className='broadcaster-upload-container'>
              <ImageUploader assetName='diamond' />
              <div><div>Replaces</div> <img className='image-preview' src={diamond} /></div>
            </div>

            <div className='broadcaster-upload-container'>
              <ImageUploader assetName='bar' />
              <div><div>Replaces</div> <img className='image-preview' src={bar} /></div>
            </div>

            <div className='broadcaster-upload-container'>
              <ImageUploader assetName='bell' />
              <div><div>Replaces</div> <img className='image-preview' src={bell} /></div>
            </div>

            <div className='broadcaster-upload-container'>
              <ImageUploader assetName='cherries' />
              <div><div>Replaces</div> <img className='image-preview' src={cherries} /></div>
            </div>

            <div className='broadcaster-upload-container'>
              <ImageUploader assetName='coin' />
              <div><div>Replaces</div> <img className='image-preview' src={coin} /></div>
            </div>

            <div className='broadcaster-upload-container'>
              <ImageUploader assetName='horseshoe' />
              <div><div>Replaces</div> <img className='image-preview' src={horseshoe} /></div>
            </div>

            <div className='broadcaster-upload-container'>
              <ImageUploader assetName='seven' />
              <div><div>Replaces</div> <img className='image-preview' src={seven} /></div>
              <div className='seven-text'>Seven is special in Lucky Leaderboard. Getting 3 of these is the Jackpot score. Upload a special image for this one!</div>
            </div>

            <div className='broadcaster-upload-container'>
              <ImageUploader assetName='plum' />
              <div><div>Replaces</div> <img className='image-preview' src={plum} /></div>
            </div>

            <div className='broadcaster-upload-container'>
              <ImageUploader assetName='lime' />
              <div><div>Replaces</div> <img className='image-preview' src={lime} /></div>
            </div>
            <button className='broadcaster-button upload-button'
              type='submit'>Upload Images</button>
          </form>
        </div>
      </div >
    );
  }
}
