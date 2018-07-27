import * as React from 'react';
import * as slot from '../../assets/img/slots.jpg';
import { Session } from '../../core/models/session';

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
  canvas?: HTMLCanvasElement;
  offsetX?: number;
  offsetY?: number;
}

interface PublicProps { }

export interface ReduxStateProps {
  session: Session;
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
    s.src = slot;

    s.addEventListener('load', this.assetsLoaded.bind(this));
    this.state = {
      canvas: c,
      slotImg: s,
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

    if (region) {
      switch (region.id) {
        case 'handle':
          play(token);
          break;

        case 'plus':
          console.log('incrementing bits');
          break;

        case 'minus':
          console.log('subtracting bits');
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
    const height = 50;
    const width = 25;

    return {
      id: 'handle',
      points: this.genRect(topleft.x, topleft.y, height, width),
      height: height,
      width: width,
    };
  }

  private getPlusBitsRegion(): Region {
    const rect = this.canvasRef.current.getBoundingClientRect();
    const topleft = { x: rect.width * 0.60, y: rect.height * 0.85 };
    const height = 25;
    const width = 25;

    return {
      id: 'plus',
      points: this.genRect(topleft.x, topleft.y, height, width),
      height: height,
      width: width,
    };
  }

  private getMinusBitsRegion(): Region {
    const rect = this.canvasRef.current.getBoundingClientRect();
    const topleft = { x: rect.width * 0.20, y: rect.height * 0.85 };
    const height = 25;
    const width = 25;

    return {
      id: 'minus',
      points: this.genRect(topleft.x, topleft.y, height, width),
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
    this.canvasRef.current.addEventListener('mousemove', this.handleMouse.bind(this));
    this.canvasRef.current.addEventListener('click', this.clickHandler.bind(this));
    this.canvasRef.current.width = this.state.slotImg.width;
    this.canvasRef.current.height = this.state.slotImg.height;
    this.setState({
      offsetX: this.canvasRef.current.getBoundingClientRect().left,
      offsetY: this.canvasRef.current.getBoundingClientRect().top,
    });
    const ctx = this.canvasRef.current.getContext('2d');
    ctx.drawImage(this.state.slotImg, 0, 0);
  }

  public render() {
    return (
      <>
        <canvas style={{ border: '1px solid black' }} ref={this.canvasRef} id='slotAnimation'></canvas>
      </>
    );
  }
}
