import * as React from 'react';
import * as machine from '../../assets/img/machine.png';
import * as lever from '../../assets/img/leverPull.png';
import { Session } from '../../core/models/session';
import { GFX } from '../../lib/gfx/gfx';
import { Score } from '../../core/models/slot-machine';


interface State {
  slotImg: HTMLImageElement;
  leverImg: HTMLImageElement;
  currentBits: number;
  gfx: GFX;
}

interface PublicProps { }

export interface ReduxStateProps {
  session: Session;
  spinning: boolean;
  lastScore: Score;
}

export interface ReduxDispatchProps {
  play: (jwt: string) => void;
}

type Props = PublicProps & ReduxDispatchProps & ReduxStateProps;
export class CanvasComponent extends React.Component<Props, State> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  constructor(props: Props) {
    super(props);

    this.canvasRef = React.createRef();
    this.state = {
      slotImg: new Image(),
      leverImg: new Image(),
      currentBits: 0,
      gfx: null,
    };
  }

  private loadSlots(): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      this.state.slotImg.src = machine;
      this.state.slotImg.onload = () => resolve(this.state.slotImg);
    });
  }

  private loadLever(): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      this.state.leverImg.src = lever;
      this.state.leverImg.onload = () => resolve(this.state.leverImg);
    });
  }

  private assetsLoaded() {
    let { slotImg, leverImg, gfx } = this.state;
    if (!gfx) {
      gfx = new GFX(slotImg, leverImg);
      gfx.setCanvasRef(this.canvasRef.current);
      gfx.setCallbackForRegion('handle', () => { this.props.play(this.props.session.token) });
      gfx.render();
    }
  }

  public render() {
    if (!this.props.session) {
      return null;
    }
    Promise.all([
      this.loadLever(),
      this.loadSlots(),
      () => {
        if (this.props.lastScore) {
          const { gfx } = this.state;
          gfx.renderText(this.props.lastScore.toString(), 50, 50);
        }
      }
    ]).then(() => this.assetsLoaded());

    return (
      <>
        <canvas ref={this.canvasRef} id='slotAnimation'></canvas>
      </>
    );
  }
}
