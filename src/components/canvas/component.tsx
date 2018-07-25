import * as React from 'react';
import * as slot from '../../assets/img/slots.jpg';
interface State {
  slotImg: HTMLImageElement;
  canvas?: HTMLCanvasElement;
  offsetX?: number;
  offsetY?: number;
}

export class Canvas extends React.Component<{}, State> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: {}) {
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

  private clickHandler(event: MouseEvent) {
    const rect = this.canvasRef.current.getBoundingClientRect();
    const c = this.canvasRef.current;
    const ctx = c.getContext('2d');
    const mouseX = (event.clientX - rect.left) / (rect.right - rect.left) * c.width;
    const mouseY = (event.clientY - rect.top) / (rect.bottom - rect.top) * c.height;

    if (ctx.isPointInPath(mouseX, mouseY)) {
      console.log('click');
    }
  }

  private handleMouse(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const c = this.canvasRef.current;
    const ctx = c.getContext('2d');
    const rect = this.canvasRef.current.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) / (rect.right - rect.left) * c.width;
    const mouseY = (event.clientY - rect.top) / (rect.bottom - rect.top) * c.height;

    if (ctx.isPointInPath(mouseX, mouseY)) {
      this.canvasRef.current.style.cursor = 'pointer';
      console.log('mousing over');
    } else {
      this.canvasRef.current.style.cursor = 'default';
    }
  }

  private initBoundaries(ctx: any) {
    const rect = this.canvasRef.current.getBoundingClientRect();

    const topleft = { x: rect.width * 0.85, y: rect.height * 0.475 };
    const points = [
      { x: topleft.x, y: topleft.y },
      { x: topleft.x, y: topleft.y + 50 },
      { x: topleft.x + 25, y: topleft.y + 50 },
      { x: topleft.x + 25, y: topleft.y }];
    ctx.beginPath();
    ctx.moveTo(topleft.x, topleft.y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.closePath();
    ctx.stroke();
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
    this.initBoundaries(ctx);
  }

  public render() {
    return (
      <>
        <canvas style={{ border: '1px solid black' }} ref={this.canvasRef} id='slotAnimation'></canvas>
      </>
    );
  }
}
