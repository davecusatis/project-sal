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
  currentY?: number;
}

interface AnimationState {
  animationID?: number;
  lever: GenericAnimationState;
  icons: GenericAnimationState & IconAnimationState;
  lights: GenericAnimationState;
}

export class GFX {
  private readonly ICON_BOTTOM = 0.85;
  private readonly ICON_TOP = 0.55;
  private pos = 0;

  private animationState: AnimationState;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private slotImg: HTMLImageElement;
  private leverImg: HTMLImageElement;
  private icons: HTMLImageElement[];
  private lightDot: HTMLImageElement;
  private lightBulb: HTMLImageElement;
  private lightGlowBase: HTMLImageElement;
  private lightGlowScreen: HTMLImageElement;
  private callbackMap: { [key: string]: Function };
  private doneAnimating: () => void;

  constructor(
    slot: HTMLImageElement,
    lever: HTMLImageElement,
    icons: HTMLImageElement[],
    lightDot: HTMLImageElement,
    lightBulb: HTMLImageElement,
    lightGlowBase: HTMLImageElement,
    lightGlowScreen: HTMLImageElement,
    doneAnimating: () => void
  ) {
    this.slotImg = slot;
    this.leverImg = lever;
    this.icons = icons;
    this.lightDot = lightDot;
    this.lightBulb = lightBulb;
    this.lightGlowBase = lightGlowBase;
    this.lightGlowScreen = lightGlowScreen;
    this.animationState = {
      lever: {
        frameIndex: 0,
        numberOfFrames: 33,
        tickCount: 0,
        ticksPerFrame: 0,
        width: 52,
        height: 132,
        animating: false,
      },
      icons: {
        toplefts: [],
        frameIndex: 0,
        numberOfFrames: 180,
        tickCount: 0,
        ticksPerFrame: 0,
        width: 128,
        height: 128 * 3,
        animating: false,
      },
      lights: {
        frameIndex: 0,
        numberOfFrames: 30,
        tickCount: 0,
        ticksPerFrame: 2,
        width: 0,
        height: 0,
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
      { x: rect.width * 0.22, y: ((rect.height) * this.ICON_TOP) + (60 * 1) },
      { x: rect.width * 0.22, y: ((rect.height) * this.ICON_TOP) + (60 * 2) },
      { x: rect.width * 0.22, y: ((rect.height) * this.ICON_TOP) + (60 * 3) },
      { x: rect.width * 0.22, y: ((rect.height) * this.ICON_TOP) + (60 * 4) },
      { x: rect.width * 0.22, y: ((rect.height) * this.ICON_TOP) + (60 * 5) },
      { x: rect.width * 0.22, y: ((rect.height) * this.ICON_TOP) + (60 * 6) },
      { x: rect.width * 0.22, y: ((rect.height) * this.ICON_TOP) + (60 * 7) },
      { x: rect.width * 0.22, y: ((rect.height) * this.ICON_TOP) + (60 * 8) },
    ];
    this.animationState.icons.currentY = 0;
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

  private renderLights() {
    const rect = this.canvas.getBoundingClientRect();
    const bulbToplefts = [
      // left side bulbs
      { x: -13, y: rect.height * 0.113 },
      { x: -12, y: rect.height * 0.17 },
      { x: -11, y: rect.height * 0.2275 },
      { x: -10, y: rect.height * 0.2835 },
      { x: -8, y: rect.height * 0.341 },
      { x: -7, y: rect.height * 0.3975 },
      { x: -6, y: rect.height * 0.455 },

      // // right side bulbs
      { x: rect.width * 0.9, y: rect.height * 0.113 },
      { x: rect.width * 0.9, y: rect.height * 0.17 },
      { x: rect.width * 0.895, y: rect.height * 0.2275 },
      { x: rect.width * 0.89, y: rect.height * 0.2835 },
      { x: rect.width * 0.8875, y: rect.height * 0.341 },
      { x: rect.width * 0.88, y: rect.height * 0.3975 },
      { x: rect.width * 0.875, y: rect.height * 0.455 },
    ];

    const dotToplefts = [
      // top row dots
      { x: rect.width * 0.07, y: rect.height * 0.135 },
      { x: rect.width * 0.11, y: rect.height * 0.135 },
      { x: rect.width * 0.15, y: rect.height * 0.135 },
      { x: rect.width * 0.19, y: rect.height * 0.135 },
      { x: rect.width * 0.23, y: rect.height * 0.135 },
      { x: rect.width * 0.27, y: rect.height * 0.135 },
      { x: rect.width * 0.31, y: rect.height * 0.135 },
      { x: rect.width * 0.35, y: rect.height * 0.135 },
      { x: rect.width * 0.39, y: rect.height * 0.135 },
      { x: rect.width * 0.43, y: rect.height * 0.135 },
      { x: rect.width * 0.47, y: rect.height * 0.135 },
      { x: rect.width * 0.51, y: rect.height * 0.135 },
      { x: rect.width * 0.55, y: rect.height * 0.135 },
      { x: rect.width * 0.59, y: rect.height * 0.135 },
      { x: rect.width * 0.63, y: rect.height * 0.135 },
      { x: rect.width * 0.67, y: rect.height * 0.135 },
      { x: rect.width * 0.71, y: rect.height * 0.135 },
      { x: rect.width * 0.75, y: rect.height * 0.135 },
      { x: rect.width * 0.79, y: rect.height * 0.135 },
      { x: rect.width * 0.83, y: rect.height * 0.135 },
      { x: rect.width * 0.87, y: rect.height * 0.135 },
      { x: rect.width * 0.91, y: rect.height * 0.135 },

      // right side dots
      // { x: rect.width * 0.07, y: rect.height * 0.515 },
      { x: rect.width * 0.9, y: rect.height * 0.17 },
      { x: rect.width * 0.897, y: rect.height * 0.2 },
      { x: rect.width * 0.895, y: rect.height * 0.23 },
      { x: rect.width * 0.894, y: rect.height * 0.26 },
      { x: rect.width * 0.891, y: rect.height * 0.2975 },
      { x: rect.width * 0.8875, y: rect.height * 0.325 },
      { x: rect.width * 0.887, y: rect.height * 0.3575 },
      { x: rect.width * 0.886, y: rect.height * 0.3875 },
      { x: rect.width * 0.8875, y: rect.height * 0.42 },
      { x: rect.width * 0.883, y: rect.height * 0.455 },
      { x: rect.width * 0.8825, y: rect.height * 0.485 },
      // { x: rect.width * 0.07, y: rect.height * 0.515 },

      // bottom row dots
      // { x: rect.width * 0.07, y: rect.height * 0.515 },

      { x: rect.width * 0.91, y: rect.height * 0.515 },
      { x: rect.width * 0.87, y: rect.height * 0.515 },
      { x: rect.width * 0.83, y: rect.height * 0.515 },
      { x: rect.width * 0.79, y: rect.height * 0.515 },
      { x: rect.width * 0.75, y: rect.height * 0.515 },
      { x: rect.width * 0.71, y: rect.height * 0.515 },
      { x: rect.width * 0.67, y: rect.height * 0.515 },
      { x: rect.width * 0.63, y: rect.height * 0.515 },
      { x: rect.width * 0.59, y: rect.height * 0.515 },
      { x: rect.width * 0.55, y: rect.height * 0.515 },
      { x: rect.width * 0.51, y: rect.height * 0.515 },
      { x: rect.width * 0.47, y: rect.height * 0.515 },
      { x: rect.width * 0.43, y: rect.height * 0.515 },
      { x: rect.width * 0.39, y: rect.height * 0.515 },
      { x: rect.width * 0.35, y: rect.height * 0.515 },
      { x: rect.width * 0.31, y: rect.height * 0.515 },
      { x: rect.width * 0.23, y: rect.height * 0.515 },
      { x: rect.width * 0.27, y: rect.height * 0.515 },
      { x: rect.width * 0.19, y: rect.height * 0.515 },
      { x: rect.width * 0.145, y: rect.height * 0.515 },
      { x: rect.width * 0.10, y: rect.height * 0.515 },

      // left side dots
      // { x: rect.width * 0.07, y: rect.height * 0.515 },
      { x: rect.width * 0.0925, y: rect.height * 0.485 },
      { x: rect.width * 0.09, y: rect.height * 0.455 },
      { x: rect.width * 0.0875, y: rect.height * 0.42 },
      { x: rect.width * 0.085, y: rect.height * 0.3875 },
      { x: rect.width * 0.08, y: rect.height * 0.3575 },
      { x: rect.width * 0.0775, y: rect.height * 0.325 },
      { x: rect.width * 0.075, y: rect.height * 0.2975 },
      { x: rect.width * 0.073, y: rect.height * 0.26 },
      { x: rect.width * 0.072, y: rect.height * 0.23 },
      { x: rect.width * 0.071, y: rect.height * 0.2 },
      { x: rect.width * 0.07, y: rect.height * 0.17 },
      // { x: rect.width * 0.07, y: rect.height * 0.515 },
    ];

    if (this.animationState.icons.animating) {
      this.ctx.drawImage(
        this.lightBulb,
        0,
        0,
        this.lightBulb.width,
        this.lightBulb.height,
        bulbToplefts[this.animationState.icons.frameIndex % 14].x,
        bulbToplefts[this.animationState.icons.frameIndex % 14].y,
        this.lightBulb.width * 0.6,
        this.lightBulb.height * 0.6,
      );
      this.ctx.drawImage(
        this.lightDot,
        0,
        0,
        this.lightBulb.width,
        this.lightBulb.height,
        dotToplefts[this.animationState.icons.frameIndex % (dotToplefts.length - 1)].x,
        dotToplefts[this.animationState.icons.frameIndex % (dotToplefts.length - 1)].y,
        this.lightBulb.width * 0.6,
        this.lightBulb.height * 0.6,
      );
    }
  }

  public renderAllLights() {
    const rect = this.canvas.getBoundingClientRect();
    const bulbToplefts = [
      // left side bulbs
      { x: -13, y: rect.height * 0.113 },
      { x: -12, y: rect.height * 0.17 },
      { x: -11, y: rect.height * 0.2275 },
      { x: -10, y: rect.height * 0.2835 },
      { x: -8, y: rect.height * 0.341 },
      { x: -7, y: rect.height * 0.3975 },
      { x: -6, y: rect.height * 0.455 },

      // // right side bulbs
      { x: rect.width * 0.9, y: rect.height * 0.113 },
      { x: rect.width * 0.9, y: rect.height * 0.17 },
      { x: rect.width * 0.895, y: rect.height * 0.2275 },
      { x: rect.width * 0.89, y: rect.height * 0.2835 },
      { x: rect.width * 0.8875, y: rect.height * 0.341 },
      { x: rect.width * 0.88, y: rect.height * 0.3975 },
      { x: rect.width * 0.875, y: rect.height * 0.455 },
    ];

    const dotToplefts = [
      // top row dots
      { x: rect.width * 0.07, y: rect.height * 0.135 },
      { x: rect.width * 0.11, y: rect.height * 0.135 },
      { x: rect.width * 0.15, y: rect.height * 0.135 },
      { x: rect.width * 0.19, y: rect.height * 0.135 },
      { x: rect.width * 0.23, y: rect.height * 0.135 },
      { x: rect.width * 0.27, y: rect.height * 0.135 },
      { x: rect.width * 0.31, y: rect.height * 0.135 },
      { x: rect.width * 0.35, y: rect.height * 0.135 },
      { x: rect.width * 0.39, y: rect.height * 0.135 },
      { x: rect.width * 0.43, y: rect.height * 0.135 },
      { x: rect.width * 0.47, y: rect.height * 0.135 },
      { x: rect.width * 0.51, y: rect.height * 0.135 },
      { x: rect.width * 0.55, y: rect.height * 0.135 },
      { x: rect.width * 0.59, y: rect.height * 0.135 },
      { x: rect.width * 0.63, y: rect.height * 0.135 },
      { x: rect.width * 0.67, y: rect.height * 0.135 },
      { x: rect.width * 0.71, y: rect.height * 0.135 },
      { x: rect.width * 0.75, y: rect.height * 0.135 },
      { x: rect.width * 0.79, y: rect.height * 0.135 },
      { x: rect.width * 0.83, y: rect.height * 0.135 },
      { x: rect.width * 0.87, y: rect.height * 0.135 },
      { x: rect.width * 0.91, y: rect.height * 0.135 },

      // right side dots
      // { x: rect.width * 0.07, y: rect.height * 0.515 },
      { x: rect.width * 0.9, y: rect.height * 0.17 },
      { x: rect.width * 0.897, y: rect.height * 0.2 },
      { x: rect.width * 0.895, y: rect.height * 0.23 },
      { x: rect.width * 0.894, y: rect.height * 0.26 },
      { x: rect.width * 0.891, y: rect.height * 0.2975 },
      { x: rect.width * 0.8875, y: rect.height * 0.325 },
      { x: rect.width * 0.887, y: rect.height * 0.3575 },
      { x: rect.width * 0.886, y: rect.height * 0.3875 },
      { x: rect.width * 0.8875, y: rect.height * 0.42 },
      { x: rect.width * 0.883, y: rect.height * 0.455 },
      { x: rect.width * 0.8825, y: rect.height * 0.485 },
      // { x: rect.width * 0.07, y: rect.height * 0.515 },

      // bottom row dots
      // { x: rect.width * 0.07, y: rect.height * 0.515 },

      { x: rect.width * 0.91, y: rect.height * 0.515 },
      { x: rect.width * 0.87, y: rect.height * 0.515 },
      { x: rect.width * 0.83, y: rect.height * 0.515 },
      { x: rect.width * 0.79, y: rect.height * 0.515 },
      { x: rect.width * 0.75, y: rect.height * 0.515 },
      { x: rect.width * 0.71, y: rect.height * 0.515 },
      { x: rect.width * 0.67, y: rect.height * 0.515 },
      { x: rect.width * 0.63, y: rect.height * 0.515 },
      { x: rect.width * 0.59, y: rect.height * 0.515 },
      { x: rect.width * 0.55, y: rect.height * 0.515 },
      { x: rect.width * 0.51, y: rect.height * 0.515 },
      { x: rect.width * 0.47, y: rect.height * 0.515 },
      { x: rect.width * 0.43, y: rect.height * 0.515 },
      { x: rect.width * 0.39, y: rect.height * 0.515 },
      { x: rect.width * 0.35, y: rect.height * 0.515 },
      { x: rect.width * 0.31, y: rect.height * 0.515 },
      { x: rect.width * 0.23, y: rect.height * 0.515 },
      { x: rect.width * 0.27, y: rect.height * 0.515 },
      { x: rect.width * 0.19, y: rect.height * 0.515 },
      { x: rect.width * 0.145, y: rect.height * 0.515 },
      { x: rect.width * 0.10, y: rect.height * 0.515 },

      // left side dots
      // { x: rect.width * 0.07, y: rect.height * 0.515 },
      { x: rect.width * 0.0925, y: rect.height * 0.485 },
      { x: rect.width * 0.09, y: rect.height * 0.455 },
      { x: rect.width * 0.0875, y: rect.height * 0.42 },
      { x: rect.width * 0.085, y: rect.height * 0.3875 },
      { x: rect.width * 0.08, y: rect.height * 0.3575 },
      { x: rect.width * 0.0775, y: rect.height * 0.325 },
      { x: rect.width * 0.075, y: rect.height * 0.2975 },
      { x: rect.width * 0.073, y: rect.height * 0.26 },
      { x: rect.width * 0.072, y: rect.height * 0.23 },
      { x: rect.width * 0.071, y: rect.height * 0.2 },
      { x: rect.width * 0.07, y: rect.height * 0.17 },
      // { x: rect.width * 0.07, y: rect.height * 0.515 },
    ];

    bulbToplefts.forEach(img => {
      this.ctx.drawImage(
        this.lightBulb,
        0,
        0,
        this.lightBulb.width,
        this.lightBulb.height,
        img.x,
        img.y,
        this.lightBulb.width * 0.6,
        this.lightBulb.height * 0.6,
      );
    });
    dotToplefts.forEach(img => {
      this.ctx.drawImage(
        this.lightDot,
        0,
        0,
        this.lightBulb.width,
        this.lightBulb.height,
        img.x,
        img.y,
        this.lightBulb.width * 0.6,
        this.lightBulb.height * 0.6,
      );
    });
    this.ctx.drawImage(
      this.lightGlowBase,
      0,
      0,
      this.lightGlowBase.width,
      this.lightGlowBase.height,
      23,
      235,
      this.lightGlowBase.width * 0.55,
      this.lightGlowBase.height * 0.55,
    );

    this.ctx.drawImage(
      this.lightGlowScreen,
      0,
      0,
      this.lightGlowScreen.width,
      this.lightGlowScreen.height,
      21,
      21,
      this.lightGlowScreen.width * 0.55,
      this.lightGlowScreen.height * 0.55,
    );
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

    const n = 9;
    const pos = this.pos % (128 * n);
    let y = top - ((pos) % 128 + 128);
    let imgIndex = Math.floor(pos / 128);
    while (y * this.ICON_BOTTOM - 60 <= bottom) {
      this.animationState.icons.toplefts[imgIndex].y = y;
      y += 60;
      const next = (imgIndex + 1) % n;
      imgIndex = next;
    }
  }

  private updateIconsAnimation() {
    this.animationState.icons.tickCount = this.animationState.icons.tickCount + 1;
    if (this.animationState.icons.tickCount > this.animationState.icons.ticksPerFrame) {
      this.animationState.icons.tickCount = 0;
      if (this.animationState.icons.frameIndex < this.animationState.icons.numberOfFrames - 1) {
        this.animationState.icons.frameIndex += 1;
        this.pos += 15;
        this.updateToplefts();
      } else {
        this.animationState.icons.frameIndex = 0;
        this.animationState.icons.animating = false;
        this.pos = 0;
        cancelAnimationFrame(this.animationState.animationID);
        this.animationState.lights.animating = true;
        this.postAnimationLoop();
      }
    }
  }

  private updateLights() {
    this.animationState.lights.tickCount = this.animationState.lights.tickCount + 1;
    if (this.animationState.lights.tickCount > this.animationState.lights.ticksPerFrame) {
      this.animationState.lights.tickCount = 0;
      if (this.animationState.lights.frameIndex < this.animationState.lights.numberOfFrames - 1) {
        this.animationState.lights.frameIndex += 1;
      } else {
        this.animationState.lights.frameIndex = 0;
        this.animationState.lights.animating = false;
        cancelAnimationFrame(this.animationState.animationID);
      }
    }
  }

  private postAnimationLoop() {
    this.animationState.animationID = window.requestAnimationFrame(() => this.postAnimationLoop());
    this.updateLights();
    this.render();
    if (this.animationState.lights.frameIndex % 6 >= 0 &&
      this.animationState.lights.frameIndex % 6 < 3) {
      this.renderAllLights();
    }
    if (!this.animationState.lights.animating) {
      this.doneAnimating();
    }
  }

  private animationLoop() {
    this.animationState.animationID = window.requestAnimationFrame(() => this.animationLoop());
    this.updateAnimation();
    this.render();
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

  public drawStops(pos: number) {
    const N = 9;
    const H = 9 * 128;
    const W = 128;
    const vW = 128;
    const vH = 128 * 3;

    let y = -pos % W;
    let index = -Math.floor(pos / W);
    index += N * (1 + index / N);
    const ctx = this.ctx;
    while (y < H) {
      ctx.drawImage(
        this.icons[index],
        0,
        y,
        this.animationState.icons.width,
        this.animationState.icons.height);
      y += W;
      index = (index + 1) % N;
    }
  }

  public renderIcons(toplefts: Point[]) {
    const rect = this.canvas.getBoundingClientRect();
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
    // this.drawStops(pos);

    const bottom = rect.height * this.ICON_BOTTOM + 60;
    const top = rect.height * this.ICON_TOP;
    toplefts.forEach((topleft, index, arr) => {
      if (arr[index].y > top - 60 && arr[index].y < bottom) {
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
      }
    });

    toplefts.forEach((topleft, index, arr) => {
      if (arr[index].y > top - 60 && arr[index].y < bottom) {
        this.ctx.drawImage(
          this.icons[index],
          0,
          0,
          this.animationState.icons.width,
          this.animationState.icons.height,
          rect.width * 0.42,
          arr[index].y,
          this.animationState.icons.width * 0.35,
          this.animationState.icons.height * 0.35);
      }
    });

    toplefts.forEach((topleft, index, arr) => {
      if (arr[index].y > top - 60 && arr[index].y < bottom) {
        this.ctx.drawImage(
          this.icons[index],
          0,
          0,
          this.animationState.icons.width,
          this.animationState.icons.height,
          rect.width * 0.62,
          arr[index].y,
          this.animationState.icons.width * 0.35,
          this.animationState.icons.height * 0.35);
      }
    });
  }

  public render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderIcons(this.animationState.icons.toplefts);
    this.renderSlotMachine();
    this.renderLights();
    this.renderLever();

  }

  private renderText(text: string, x: number, y: number) {
    this.ctx.fillText(text, x, y);
  }
}
