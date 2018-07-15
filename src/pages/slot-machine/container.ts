import { GlobalState } from "../../core/models/global-state";
import { getContext } from '../../core/reducers/context';
import { getSession } from '../../core/reducers/session';
import { ReduxStateProps, SlotMachinePageComponent, PublicProps } from './component';
import { connect } from 'react-redux';

function mapStateToProps(state: GlobalState): ReduxStateProps {
  return {
    context: getContext(state),
    session: getSession(state)
  };
}

export const SlotMachinePage = connect<ReduxStateProps, null, PublicProps>(mapStateToProps)(SlotMachinePageComponent);
