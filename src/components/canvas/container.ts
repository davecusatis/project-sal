import { GlobalState } from '../../core/models/global-state';
import { connect } from 'react-redux';
import { CanvasComponent, ReduxStateProps } from './component';
import { getSession } from '../../core/reducers/session';

function mapStateToProps(state: GlobalState): ReduxStateProps {
  return {
    session: getSession(state)
  };
}

export const Canvas = connect<ReduxStateProps>(mapStateToProps)(CanvasComponent);
