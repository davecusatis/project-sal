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

interface State { }

export interface PublicProps { }
export type RouteProps = RouteComponentProps<{}>;
export interface ReduxStateProps {
  session?: Session;
  isBroadcaster: boolean;
}


type Props = PublicProps & ReduxStateProps & RouteProps;
export class BroadcasterConfigPageComponent extends React.Component<Props, State> {
  private onSubmitSlotName(event: React.FormEvent<HTMLFormElement>) {

  }

  private onSubmitImages(event: React.FormEvent<HTMLFormElement>) {
    console.log(event.target);
    console.log(event.currentTarget);
  }

  public render() {
    if (!this.props.isBroadcaster) {
      return null;
    }

    return (
      <div className='broadcaster-page'>
        <div className='slot machine title'>
          <div>Customize the name of your slot machine</div>
          <form onSubmit={e => this.onSubmitSlotName(e)} >
            <input></input>
          </form>
        </div>
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
          <form onSubmit={e => this.onSubmitImages(e)} >
            <div className='broadcaster-upload-container'>
              <ImageUploader assetName='1' />
              <div><div>Replaces</div> <img className='image-preview' src={diamond} /></div>
            </div>

            <div className='broadcaster-upload-container'>
              <ImageUploader assetName='2' />
              <div><div>Replaces</div> <img className='image-preview' src={bar} /></div>
            </div>

            <div className='broadcaster-upload-container'>
              <ImageUploader assetName='3' />
              <div><div>Replaces</div> <img className='image-preview' src={bell} /></div>
            </div>

            <div className='broadcaster-upload-container'>
              <ImageUploader assetName='4' />
              <div><div>Replaces</div> <img className='image-preview' src={cherries} /></div>
            </div>

            <div className='broadcaster-upload-container'>
              <ImageUploader assetName='5' />
              <div><div>Replaces</div> <img className='image-preview' src={coin} /></div>
            </div>

            <div className='broadcaster-upload-container'>
              <ImageUploader assetName='6' />
              <div><div>Replaces</div> <img className='image-preview' src={horseshoe} /></div>
            </div>

            <div className='broadcaster-upload-container'>
              <ImageUploader assetName='7' />
              <div><div>Replaces</div> <img className='image-preview' src={seven} /></div>
              <div className='seven-text'>Seven is special in Lucky Leaderboard. Getting 3 of these is the Jackpot score. Upload a special image for this one!</div>
            </div>

            <div className='broadcaster-upload-container'>
              <ImageUploader assetName='8' />
              <div><div>Replaces</div> <img className='image-preview' src={plum} /></div>
            </div>

            <div className='broadcaster-upload-container'>
              <ImageUploader assetName='9' />
              <div><div>Replaces</div> <img className='image-preview' src={lime} /></div>
            </div>
            <button className='submitButton'
              type='submit'>Upload Images</button>
          </form>
        </div>
      </div >
    );
  }
}
