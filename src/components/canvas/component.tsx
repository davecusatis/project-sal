import * as React from 'react';
import * as machine from '../../assets/img/machine.png';
import * as lever from '../../assets/img/leverPull.png';
import * as icons from '../../assets/img/icons.png';
import { Session } from '../../core/models/session';
import { SlotsState } from '../../lib/slots/slots';
import { app } from '../../core/app';

interface State {
  slotImg: HTMLImageElement;
  leverImg: HTMLImageElement;
  iconsImg: HTMLImageElement;
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
      iconsImg: new Image(),
      currentBits: 0,
      slots: null,
    };
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

  private loadIcons(): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      this.state.iconsImg.src = icons;
      this.state.iconsImg.onload = () => resolve(this.state.iconsImg);
    });
  }

  private load() {
    let { slots } = this.state;
    slots = new SlotsState(app.store);
    slots.loadSlots(
      this.state.slotImg,
      this.state.leverImg,
      this.state.iconsImg,
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
      this.loadIcons(),
    ]).then(() => this.load());

    return (
      <>
        <canvas ref={this.canvasRef} id='slotAnimation'></canvas>
      </>
    );
  }
}
