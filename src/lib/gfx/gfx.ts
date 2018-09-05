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

interface GenericAnimationState {
  frameIndex: number;
  numberOfFrames: number;
  tickCount: number;
  ticksPerFrame: number;
  width: number;
  height: number;
  animating: boolean;
}

interface IconAnimationState {
  toplefts: Point[];
}

interface AnimationState {
  animationID?: number;
  lever: GenericAnimationState;
  icons: GenericAnimationState & IconAnimationState;
}

export class GFX {
  private readonly ICON_BOTTOM = 0.85;
  private readonly ICON_TOP = 0.45;

  private animationState: AnimationState;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private slotImg: HTMLImageElement;
  private leverImg: HTMLImageElement;
  private icons: HTMLImageElement[];
  private callbackMap: { [key: string]: Function };
  private doneAnimating: () => void;

  constructor(slot: HTMLImageElement, lever: HTMLImageElement, icons: HTMLImageElement[], doneAnimating: () => void) {
    this.slotImg = slot;
    this.leverImg = lever;
    this.icons = icons;
    this.animationState = {
      lever: {
        frameIndex: 0,
        numberOfFrames: 33,
        tickCount: 0,
        ticksPerFrame: 1,
        width: 52,
        height: 132,
        animating: false,
      },
      icons: {
        toplefts: [],
        frameIndex: 0,
        numberOfFrames: 120,
        tickCount: 0,
        ticksPerFrame: 0,
        width: 128,
        height: 128,
        animating: false,
      }
    }
    this.callbackMap = {}
    this.doneAnimating = doneAnimating;
  }

  public setCanvasRef(c: HTMLCanvasElement) {
    // TODO: make these more dynamic, based on extension context
    c.width = 300;
    c.height = 433;
    this.canvas = c;
    this.ctx = c.getContext('2d');

    this.canvas.addEventListener('mousemove', this.handleMouse.bind(this));
    this.canvas.addEventListener('mousedown', this.clickHandler.bind(this));

    const rect = this.canvas.getBoundingClientRect();
    this.animationState.icons.toplefts = [
      // height must be between .45-.85
      { x: rect.width * 0.22, y: (rect.height * this.ICON_TOP) },
      { x: rect.width * 0.22, y: ((rect.height + (127 * 1)) * this.ICON_TOP) },
      { x: rect.width * 0.22, y: ((rect.height + (127 * 2)) * this.ICON_TOP) },
      { x: rect.width * 0.22, y: ((rect.height + (127 * 3)) * this.ICON_TOP) },
      { x: rect.width * 0.22, y: ((rect.height + (127 * 4)) * this.ICON_TOP) },
      { x: rect.width * 0.22, y: ((rect.height + (127 * 5)) * this.ICON_TOP) },
      { x: rect.width * 0.22, y: ((rect.height + (127 * 6)) * this.ICON_TOP) },
      { x: rect.width * 0.22, y: ((rect.height + (127 * 7)) * this.ICON_TOP) },
      { x: rect.width * 0.22, y: ((rect.height + (127 * 8)) * this.ICON_TOP) },
    ];
  }

  public getMouse(event: MouseEvent): MousePosition {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) / (rect.right - rect.left) * this.canvas.width;
    const mouseY = (event.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.height;

    return { x: mouseX, y: mouseY };
  }

  public setCallbackForRegion(region: string, callback: Function) {
    this.callbackMap[region] = callback;
  }

  public clickHandler(event: MouseEvent) {
    if (this.animationState.lever.animating) {
      return;
    }
    const { x, y } = this.getMouse(event);
    const region = this.isInPath(x, y);
    if (region && region.id) {
      this.callbackMap[region.id]();
      if (region.id === 'handle') {
        this.animationState.lever.animating = true;
        this.animationState.icons.animating = true;
        this.animationLoop();
      }
    }
  }

  public handleMouse(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.animationState.icons.animating) {
      const { x, y } = this.getMouse(event);
      const region = this.isInPath(x, y);
      if (region) {
        this.canvas.style.cursor = 'pointer';
      } else {
        this.canvas.style.cursor = 'default';
      }
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
  }

  private renderLever() {
    const rect = this.canvas.getBoundingClientRect();
    const topleft = { x: rect.width * 0.81, y: rect.height * 0.5 }
    this.ctx.drawImage(
      this.leverImg,
      this.animationState.lever.frameIndex * this.animationState.lever.width,
      0,
      this.animationState.lever.width,
      this.animationState.lever.height,
      topleft.x,
      topleft.y,
      this.animationState.lever.width,
      this.animationState.lever.height);
  }

  private updateAnimation() {
    if (this.animationState.lever.animating) {
      this.updateLeverAnimation();
    }
    this.updateIconsAnimation();
  }

  private updateLeverAnimation() {
    this.animationState.lever.tickCount = this.animationState.lever.tickCount + 1;
    if (this.animationState.lever.tickCount > this.animationState.lever.ticksPerFrame) {
      this.animationState.lever.tickCount = 0;
      if (this.animationState.lever.frameIndex < this.animationState.lever.numberOfFrames - 1) {
        this.animationState.lever.frameIndex += 1;
      } else {
        this.animationState.lever.frameIndex = 0;
        this.animationState.lever.animating = false;
      }
    }
  }

  private updateToplefts() {
    const rect = this.canvas.getBoundingClientRect();
    const bottom = rect.height * this.ICON_BOTTOM;
    const top = rect.height * this.ICON_TOP;
    this.animationState.icons.toplefts = this.animationState.icons.toplefts.map(topleft => {
      console.log(topleft.y);
      if (topleft.y < bottom) {
        return {
          x: topleft.x,
          y: topleft.y + (76.8 / 10)
        };
      }
      return {
        x: topleft.x,
        y: top,
      };
    });
  }

  private updateIconsAnimation() {
    this.animationState.icons.tickCount = this.animationState.icons.tickCount + 1;
    if (this.animationState.icons.tickCount > this.animationState.icons.ticksPerFrame) {
      this.animationState.icons.tickCount = 0;
      if (this.animationState.icons.frameIndex < this.animationState.icons.numberOfFrames - 1) {
        this.animationState.icons.frameIndex += 1;
        this.updateToplefts();
      } else {
        this.animationState.icons.frameIndex = 0;
        this.animationState.icons.animating = false;
        cancelAnimationFrame(this.animationState.animationID);
      }
    }
  }

  private animationLoop() {
    this.animationState.animationID = window.requestAnimationFrame(() => this.animationLoop());
    this.updateAnimation();
    this.render();
    if (!this.animationState.icons.animating) {
      this.doneAnimating();
    }
  }

  public renderBits(bits: number) {
    const rect = this.canvas.getBoundingClientRect();
    const topleft = { x: rect.width * 0.745, y: rect.height * 0.955 };
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px serif';
    this.renderText(bits.toString(), topleft.x, topleft.y);
  }

  public renderScore(score: string) {
    const rect = this.canvas.getBoundingClientRect();
    const topleft = { x: rect.width * 0.35, y: rect.height * 0.33 };
    this.ctx.fillStyle = 'white';
    this.ctx.font = '48px serif';
    this.renderText(score, topleft.x, topleft.y);
  }

  public renderIcons(toplefts: Point[]) {
    // const rect = this.canvas.getBoundingClientRect();
    // const toplefts = [
    //   { x: rect.width * 0.22, y: rect.height * 0.55 },
    //   { x: rect.width * 0.42, y: rect.height * 0.55 },
    //   { x: rect.width * 0.62, y: rect.height * 0.55 },
    // ];
    // const updateHeight = this.animationState.icons.frameIndex * 19.2;

    // toplefts.forEach(topleft => {
    //   this.ctx.drawImage(
    //     this.iconsImg,
    //     0,
    //     updateHeight,
    //     this.animationState.icons.width,
    //     this.animationState.icons.height,
    //     topleft.x,
    //     topleft.y,
    //     this.animationState.icons.width * 0.35,
    //     this.animationState.icons.height * 0.35);
    // });
    console.log("TOPLEFTS IN RENDER: ", toplefts)
    toplefts.forEach((topleft, index, arr) => {
      console.log('topleft: ', topleft, '\nfor img', this.icons[index]);
      this.ctx.drawImage(
        this.icons[index],
        0,
        0,
        this.animationState.icons.width,
        this.animationState.icons.height,
        arr[index].x,
        arr[index].y,
        this.animationState.icons.width * 0.35,
        this.animationState.icons.height * 0.35);
    });
  }

  public render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderIcons(this.animationState.icons.toplefts);
    this.renderSlotMachine();
    this.renderLever();
  }

  private renderText(text: string, x: number, y: number) {
    this.ctx.fillText(text, x, y);
  }
}
