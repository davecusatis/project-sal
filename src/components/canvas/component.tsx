import * as React from 'react';
import * as machine from '../../assets/img/machine.png';
import * as lever from '../../assets/img/leverPull.png';
import { Session } from '../../core/models/session';
import { GFX } from '../../lib/gfx/gfx';


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
  lastScore: number;
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

    let s = new Image();
    s.src = machine;

    let l = new Image();
    l.src = lever;

    s.addEventListener('load', this.assetsLoaded.bind(this));
    this.state = {
      slotImg: s,
      leverImg: l,
      currentBits: 0,
      gfx: null,
    };
  }

  private assetsLoaded() {
    let { slotImg, leverImg, gfx } = this.state;
    gfx = new GFX(
      slotImg,
      leverImg),

      this.canvasRef.current.width = 300;
    this.canvasRef.current.height = 433;

    gfx.setCanvasRef(this.canvasRef.current);
    gfx.render();
  }

  public render() {
    if (this.props.lastScore) {
      let ctx: CanvasRenderingContext2D;
      ctx.font = '48px serif';
      ctx.fillText(this.props.lastScore.toString(), 50, 50);
    }
    return (
      <>
        <canvas ref={this.canvasRef} id='slotAnimation'></canvas>
      </>
    );
  }
}
