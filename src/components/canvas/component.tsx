import * as React from 'react';
import * as slot from '../../assets/img/slots.jpg';
import * as machine from '../../assets/img/machine.png';
import { Session } from '../../core/models/session';

const DEBUG = true;

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

interface State {
  slotImg: HTMLImageElement;
  currentBits: number;
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

    const c = this.canvasRef.current;

    let s = new Image();
    s.src = machine;

    s.addEventListener('load', this.assetsLoaded.bind(this));
    this.state = {
      slotImg: s,
      currentBits: 0,
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

  public render() {
    let ctx: CanvasRenderingContext2D;
    if (this.canvasRef.current) {
      ctx = this.canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
      ctx.drawImage(this.state.slotImg, 0, 0, this.state.slotImg.width, this.state.slotImg.height,
        0, 0, 300, 433);
      ctx.font = '18px serif';
      ctx.fillStyle = 'white';
      ctx.fillText(this.state.currentBits.toString(), 227, 415);
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
