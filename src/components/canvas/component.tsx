import * as React from 'react';
import * as machine from '../../assets/img/machine.png';
import * as lever from '../../assets/img/leverPull2.png';
import { Session } from '../../core/models/session';
import { spinning } from '../../core/reducers/slot-machine';

const DEBUG = false;

interface MousePosition {
  x: number;
  y: number;
}

interface Region {
  id: string;
  points: Point[];
  height: number;
  width: number;
}

interface Point {
  x: number;
  y: number;
}

interface LeverState {
  frameIndex: number;
  numberOfFrames: number;
  tickCount: number;
  ticksPerFrame: number;
  width: number;
  height: number;
}

interface State {
  slotImg: HTMLImageElement;
  leverImg: HTMLImageElement;
  currentBits: number;
  leverState: LeverState;
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

const leverState = React.createContext({
  frameIndex: 0,
  numberOfFrames: 14,
  tickCount: 0,
  ticksPerFrame: 4,
  width: 52,
  height: 132,
});

type Props = PublicProps & ReduxDispatchProps & ReduxStateProps;
export class CanvasComponent extends React.Component<Props, State> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;

  set leverState(ls: any) {
    this.leverState = ls
  }

  constructor(props: Props) {
    super(props);

    this.canvasRef = React.createRef();

    const c = this.canvasRef.current;

    let s = new Image();
    s.src = machine;

    let l = new Image();
    l.src = lever;

    s.addEventListener('load', this.assetsLoaded.bind(this));
    this.state = {
      slotImg: s,
      leverImg: l,
      currentBits: 0,
      leverState: this.leverState,
    };
  }

  private getMouse(event: MouseEvent): MousePosition {
    const c = this.canvasRef.current;
    const rect = c.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) / (rect.right - rect.left) * c.width;
    const mouseY = (event.clientY - rect.top) / (rect.bottom - rect.top) * c.height;

    return { x: mouseX, y: mouseY };
  }

  private clickHandler(event: MouseEvent) {
    const { x, y } = this.getMouse(event);
    const region = this.isInPath(x, y);
    const {
      session: {
        token
      }, play
    } = this.props;
    const { currentBits: bits } = this.state;

    if (region) {
      switch (region.id) {
        case 'handle':
          play(token);
          this.animating = true;
          break;

        case 'plus':
          if (bits < 10000) {
            this.setState({
              currentBits: bits + 100,
            });
          }
          break;

        case 'minus':
          if (bits > 0) {
            this.setState({
              currentBits: bits - 100,
            });
          }
          break;
      }
    } else {
      console.log('no region clicked');
    }
  }

  private handleMouse(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const { x, y } = this.getMouse(event);
    const region = this.isInPath(x, y);
    if (region) {
      this.canvasRef.current.style.cursor = 'pointer';
    } else {
      this.canvasRef.current.style.cursor = 'default';
    }
  }

  private genRect(topleftX: number, topleftY: number, height: number, width: number): Point[] {
    return [
      { x: topleftX, y: topleftY },
      { x: topleftX, y: topleftY + height },
      { x: topleftX + width, y: topleftY + height },
      { x: topleftX + width, y: topleftY }
    ];
  }

  private getHandleRegion(): Region {
    const rect = this.canvasRef.current.getBoundingClientRect();
    const topleft = { x: rect.width * 0.85, y: rect.height * 0.475 };
    const height = 120;
    const width = 50;

    const p = this.genRect(topleft.x, topleft.y, height, width);

    if (DEBUG) {
      const ctx = this.canvasRef.current.getContext('2d');
      ctx.rect(p[0].x, p[0].y, width, height);
      ctx.stroke();
    }

    return {
      id: 'handle',
      points: p,
      height: height,
      width: width,
    };
  }

  private getPlusBitsRegion(): Region {
    const rect = this.canvasRef.current.getBoundingClientRect();
    const topleft = { x: rect.width * 0.31, y: rect.height * 0.91 };
    const height = 25;
    const width = 50;

    const p = this.genRect(topleft.x, topleft.y, height, width);
    if (DEBUG) {
      const ctx = this.canvasRef.current.getContext('2d');
      ctx.rect(p[0].x, p[0].y, width, height);
    }
    return {
      id: 'plus',
      points: p,
      height: height,
      width: width,
    };
  }

  private getMinusBitsRegion(): Region {
    const rect = this.canvasRef.current.getBoundingClientRect();
    const topleft = { x: rect.width * 0.52, y: rect.height * 0.91 };
    const height = 25;
    const width = 50;

    const p = this.genRect(topleft.x, topleft.y, height, width);
    if (DEBUG) {
      const ctx = this.canvasRef.current.getContext('2d');
      ctx.rect(p[0].x, p[0].y, width, height);
    }
    return {
      id: 'minus',
      points: p,
      height: height,
      width: width,
    };
  }

  private isInPath(mouseX: number, mouseY: number): Region {
    let regions: Region[] = [];

    regions.push(this.getHandleRegion());
    regions.push(this.getMinusBitsRegion());
    regions.push(this.getPlusBitsRegion());

    const res = regions.filter(region => (
      mouseX >= region.points[0].x &&
      mouseX <= (region.points[0].x + region.width) &&
      mouseY >= region.points[0].y &&
      mouseY <= (region.points[0].y + region.height)
    ));

    return res.length > 0 && res[0];
  }

  private assetsLoaded() {
    const { slotImg } = this.state;
    this.canvasRef.current.addEventListener('mousemove', this.handleMouse.bind(this));
    this.canvasRef.current.addEventListener('click', this.clickHandler.bind(this));
    this.canvasRef.current.width = 300;
    this.canvasRef.current.height = 433;
    const ctx = this.canvasRef.current.getContext('2d');
    ctx.drawImage(slotImg, 0, 0, slotImg.width, slotImg.height,
      0, 0, 300, 433);
  }

  private renderSlotMachine(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
    ctx.drawImage(
      this.state.slotImg,
      0,
      0,
      this.state.slotImg.width,
      this.state.slotImg.height,
      0,
      0,
      300,
      433);
    ctx.font = '18px serif';
    ctx.fillStyle = 'white';
    ctx.fillText(this.state.currentBits.toString(), 227, 415);
  }

  private renderLever(ctx: CanvasRenderingContext2D) {
    const rect = this.canvasRef.current.getBoundingClientRect();
    const topleft = { x: rect.width * 0.81, y: rect.height * 0.5 }
    const { leverImg } = this.state;
    console.log('frame index ', leverState);
    console.log('selection: ', leverState.width * leverState.frameIndex)
    ctx.drawImage(
      leverImg,
      leverState.frameIndex * leverState.width,
      0,
      leverState.width,
      leverState.height,
      topleft.x,
      topleft.y,
      leverState.width,
      leverState.height);
  }

  private updateLever() {
    leverState.tickCount = leverState.tickCount + 1;
    if (leverState.tickCount > leverState.ticksPerFrame) {
      leverState.tickCount = 0;
      if (leverState.frameIndex < leverState.numberOfFrames - 1) {
        // Go to the next frame
        leverState = {
          ...leverState,
          frameIndex: leverState.frameIndex + 1,
        };
      } else {
        this.animating = false;
        leverState = {
          ...leverState,
          frameIndex: 0,
        };
      }
    }
  }

  private animateLever(ctx: CanvasRenderingContext2D): FrameRequestCallback {
    return () => {
      this.updateLever();
      this.renderLever(ctx);
    }
  }

  private animating = false;
  public render() {
    let ctx: CanvasRenderingContext2D;
    if (this.canvasRef.current) {
      ctx = this.canvasRef.current.getContext('2d');
      if (this.animating) {
        window.requestAnimationFrame(this.animateLever(ctx));
      } else {
      }
      this.renderSlotMachine(ctx);
      this.renderLever(ctx);
    }

    if (this.props.lastScore) {
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
