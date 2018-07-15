import { applyMiddleware, createStore, Reducer, combineReducers, Store as ReduxStore } from 'redux';
import thunk from 'redux-thunk';
import { Action } from './models/actions';
import { GlobalState } from './models/global-state';
import { contextReducer } from './reducers/context';
import { sessionReducer } from './reducers/session';
import { slotMachineReducer } from './reducers/slot-machine';

interface AppState {
  [key: string]: object;
}

export class Store {
  private reduxStore: ReduxStore<AppState>;
  private rootReducer: Reducer;

  private initRootReducer(): Reducer {
    return combineReducers({
      context: contextReducer,
      session: sessionReducer,
      slotMachine: slotMachineReducer,
    });
  }

  constructor() {
    this.rootReducer = this.initRootReducer();

    this.reduxStore = createStore(
      this.rootReducer,
      applyMiddleware(thunk),
    );
  }

  public dispatch<T>(action: Action<T>) {
    //tslint:disable-next-line:no-any
    return this.reduxStore.dispatch(action as any);
  }

  public getState() {
    return (this.reduxStore.getState() as {}) as GlobalState;
  }

  public getReduxStore() {
    return (this.reduxStore as {}) as ReduxStore<GlobalState>;
  }
};
