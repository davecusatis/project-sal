import * as React from 'react';
import * as machine from '../../assets/img/machine.png';
import * as lever from '../../assets/img/leverPull.png';
import * as bar from '../../assets/img/iconBar.png';
import * as bell from '../../assets/img/iconBell.png';
import * as cherries from '../../assets/img/iconCherries.png';
import * as coin from '../../assets/img/iconCoin.png';
import * as horseshoe from '../../assets/img/iconHorseshoe.png';
import * as lime from '../../assets/img/iconLime.png';
import * as plum from '../../assets/img/iconPlum.png';
import * as lightDot from '../../assets/img/lightDot.png';
import * as lightBulb from '../../assets/img/lightBulb.png';
import * as seven from '../../assets/img/iconSeven.png';
import * as diamond from '../../assets/img/iconDiamond.png';
import { Session } from '../../core/models/session';
import { SlotsState } from '../../lib/slots/slots';
import { app } from '../../core/app';

interface State {
  slotImg: HTMLImageElement;
  leverImg: HTMLImageElement;
  iconsImg: HTMLImageElement[];
  lightBulb: HTMLImageElement;
  lightDot: HTMLImageElement;
  currentBits: number;
  slots: SlotsState;
}

interface PublicProps { }

export interface ReduxStateProps {
  session: Session;
}

type Props = PublicProps & ReduxStateProps;
export class CanvasComponent extends React.Component<Props, State> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  constructor(props: Props) {
    super(props);

    this.canvasRef = React.createRef();
    this.state = {
      slotImg: new Image(),
      leverImg: new Image(),
      lightDot: new Image(),
      lightBulb: new Image(),
      iconsImg: [
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image(),
      ],
      currentBits: 0,
      slots: null,
    };
  }

  private loadLights(): Promise<HTMLImageElement>[] {
    return [
      new Promise((resolve) => {
        this.state.lightDot.src = lightDot;
        this.state.lightDot.onload = () => resolve(this.state.lightDot);
      }),
      new Promise((resolve) => {
        this.state.lightBulb.src = lightBulb;
        this.state.lightBulb.onload = () => resolve(this.state.lightBulb);
      })];
  }

  private loadSlots(): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      this.state.slotImg.src = machine;
      this.state.slotImg.onload = () => resolve(this.state.slotImg);
    });
  }

  private loadLever(): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      this.state.leverImg.src = lever;
      this.state.leverImg.onload = () => resolve(this.state.leverImg);
    });
  }

  private loadIcons(): Promise<HTMLImageElement>[] {
    return [bar, bell, cherries, coin, horseshoe, lime, plum, seven, diamond].map((img, index) => {
      return new Promise((resolve) => {
        this.state.iconsImg[index].src = img;
        this.state.iconsImg[index].onload = () => resolve(this.state.iconsImg[index]);
      });
    });
  }

  private load() {
    let { slots } = this.state;
    slots = new SlotsState(app.store);
    slots.loadSlots(
      this.state.slotImg,
      this.state.leverImg,
      this.state.iconsImg,
      this.state.lightDot,
      this.state.lightBulb,
      this.canvasRef.current,
    )
  }

  public render() {
    if (!this.props.session) {
      return null;
    }
    Promise.all([
      this.loadLever(),
      this.loadSlots(),
      ...this.loadIcons(),
      ...this.loadLights(),
    ]).then(() => this.load());

    return (
      <>
        <canvas ref={this.canvasRef} id='slotAnimation'></canvas>
      </>
    );
  }
}
