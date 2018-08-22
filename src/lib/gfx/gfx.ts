import * as React from 'react';
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

interface CommonAnimationState {
  animationID?: number;
  animating: boolean;
}

type AnimationState = CommonAnimationState & LeverState;

export class GFX {
  private animationState: AnimationState;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private slotImg: HTMLImageElement;
  private leverImg: HTMLImageElement;

  constructor(slot: HTMLImageElement, lever: HTMLImageElement) {
    this.slotImg = slot;
    this.leverImg = lever;
    this.animationState = {
      animating: false,
      frameIndex: 0,
      numberOfFrames: 33,
      tickCount: 0,
      ticksPerFrame: 1,
      width: 52,
      height: 132,
    }
  }

  public setCanvasRef(c: HTMLCanvasElement) {
    this.canvas = c;
    this.ctx = c.getContext('2d');

    this.canvas.addEventListener('mousemove', this.handleMouse.bind(this));
    this.canvas.addEventListener('click', this.clickHandler.bind(this));

  }

  public getMouse(event: MouseEvent): MousePosition {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) / (rect.right - rect.left) * this.canvas.width;
    const mouseY = (event.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.height;

    return { x: mouseX, y: mouseY };
  }

  public clickHandler(event: MouseEvent) {
    const { x, y } = this.getMouse(event);
    const region = this.isInPath(x, y);
    // const { currentBits: bits } = this.state;

    if (region) {
      switch (region.id) {
        case 'handle':
          // this.play(this.token);
          console.log('handle click');
          this.ctx.fillText('handle clicked', 227, 415);
          this.animationState.animating = true;
          window.requestAnimationFrame(() => this.animationLoop());
          break;

        case 'plus':
          console.log('increase bits');
          //   if (bits < 10000) {
          //     // this.setState({
          //     //   currentBits: bits + 100,
          //     // });
          //   }
          break;

        case 'minus':
          console.log('decrease bits');
          // if (bits > 0) {
          // this.setState({
          //   currentBits: bits - 100,
          // });
          // }
          break;
      }
    }
  }

  public handleMouse(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const { x, y } = this.getMouse(event);
    const region = this.isInPath(x, y);
    if (region) {
      this.canvas.style.cursor = 'pointer';
    } else {
      this.canvas.style.cursor = 'default';
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
    const rect = this.canvas.getBoundingClientRect();
    const topleft = { x: rect.width * 0.85, y: rect.height * 0.475 };
    const height = 120;
    const width = 50;

    const p = this.genRect(topleft.x, topleft.y, height, width);

    if (DEBUG) {
      const ctx = this.canvas.getContext('2d');
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
    const rect = this.canvas.getBoundingClientRect();
    const topleft = { x: rect.width * 0.31, y: rect.height * 0.91 };
    const height = 25;
    const width = 50;

    const p = this.genRect(topleft.x, topleft.y, height, width);
    if (DEBUG) {
      const ctx = this.canvas.getContext('2d');
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
    const rect = this.canvas.getBoundingClientRect();
    const topleft = { x: rect.width * 0.52, y: rect.height * 0.91 };
    const height = 25;
    const width = 50;

    const p = this.genRect(topleft.x, topleft.y, height, width);
    if (DEBUG) {
      const ctx = this.canvas.getContext('2d');
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

  private renderSlotMachine() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      this.slotImg,
      0,
      0,
      this.slotImg.width,
      this.slotImg.height,
      0,
      0,
      300,
      433);
    this.ctx.font = '18px serif';
    this.ctx.fillStyle = 'white';
  }

  private renderLever() {
    const rect = this.canvas.getBoundingClientRect();
    const topleft = { x: rect.width * 0.81, y: rect.height * 0.5 }
    this.ctx.drawImage(
      this.leverImg,
      this.animationState.frameIndex * this.animationState.width,
      0,
      this.animationState.width,
      this.animationState.height,
      topleft.x,
      topleft.y,
      this.animationState.width,
      this.animationState.height);
  }

  private updateAnimation() {
    this.animationState.tickCount = this.animationState.tickCount + 1;
    if (this.animationState.tickCount > this.animationState.ticksPerFrame) {
      this.animationState.tickCount = 0;
      if (this.animationState.frameIndex < this.animationState.numberOfFrames - 1) {
        this.animationState.frameIndex += 1;
      } else {
        this.animationState.animating = false;
        this.animationState.frameIndex = 0;
        cancelAnimationFrame(this.animationState.animationID);
      }
    }
  }

  private animationLoop() {
    this.animationState.animationID = window.requestAnimationFrame(() => this.animationLoop());
    this.updateAnimation();
    this.renderSlotMachine();
    this.renderLever();
  }

  public render() {

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderSlotMachine();
    this.renderLever();
  }
}
