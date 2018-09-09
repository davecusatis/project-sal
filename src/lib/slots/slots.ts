import { Score } from "../../core/models/slot-machine";
import { GFX } from "../gfx/gfx";
import { GlobalState } from "../../core/models/global-state";
import { Store as ReduxStore } from 'redux';
import * as slotActions from '../../core/actions/slot-machine';
import { getSession } from "../../core/reducers/session";
import { Store } from "../../core/app-store";

export class SlotsState {
  private bits: number;
  private score: Score;
  private gfx: GFX;
  private redux: ReduxStore<GlobalState>;
  private store: Store;

  constructor(store: Store) {
    this.store = store;
    this.redux = store.getReduxStore();
    this.score = null;
    this.bits = 0;

    window.Twitch.ext.listen('broadcast', (target: any, contentType: any, message: any) => {
      message = JSON.parse(message);
      switch (message.type) {
        case 'scoreUpdated':
          this.updateScore(message.data.score);
          break;
        default:
          break;
      }
    });
  }

  private updateScore(score: Score) {
    this.score = score;
    this.redux.dispatch(slotActions.scoreUpdated(score));
  }

  private handleLever() {
    const sess = getSession(this.store.getState());
    this.redux.dispatch(slotActions.play(sess.token));
  }

  private renderBits() {
    this.gfx.renderBits(this.bits);
  }

  private handleBitsPlus() {
    if (this.bits < 10000) {
      this.bits += 100;
    }
    this.updateGFX();
  }

  private handleBitsMinus() {
    if (this.bits > 0) {
      this.bits -= 100;
    }
    this.updateGFX();
  }

  private updateGFX() {
    this.gfx.render();
    this.renderBits();
    this.gfx.renderScore(this.score.score);
    this.gfx.renderAllLights();
  }

  private doneAnimating() {
    this.updateGFX();
  }

  public loadSlots(
    slotImg: HTMLImageElement,
    leverImg: HTMLImageElement,
    iconsImg: HTMLImageElement[],
    lightDot: HTMLImageElement,
    lightBulb: HTMLImageElement,
    lightGlowBase: HTMLImageElement,
    lightGlowScreen: HTMLImageElement,
    canvas: HTMLCanvasElement) {
    this.gfx = new GFX(
      slotImg,
      leverImg,
      iconsImg,
      lightDot,
      lightBulb,
      lightGlowBase,
      lightGlowScreen,
      () => { this.doneAnimating() },
    );
    this.gfx.setCanvasRef(canvas);
    this.gfx.setCallbackForRegion('handle', () => { this.handleLever() });
    this.gfx.setCallbackForRegion('plus', () => { this.handleBitsPlus() });
    this.gfx.setCallbackForRegion('minus', () => { this.handleBitsMinus() });
    this.gfx.render();
    this.updateGFX();
  }
}
