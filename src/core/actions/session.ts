import { Action } from '../models/actions';
import { Session } from '../models/session';
import { Twitch } from '../models/twitch';

export const ON_AUTHORIZED = 'core.onAuthorized';
export const LINK_IDENTITY = 'core.linkIdentity';

export interface onAuthorizedSession extends Action<typeof ON_AUTHORIZED> {
  session: Session;
}

export interface linkIdentitySession extends Action<typeof LINK_IDENTITY> { }

export type All = (
  | onAuthorizedSession
  | linkIdentitySession
);

export function onAuthorized(session: Session): onAuthorizedSession {
  return {
    type: ON_AUTHORIZED,
    session
  };
}

export function linkIdentity(twitch: Twitch): linkIdentitySession {
  twitch.actions.requestIdShare();
  return {
    type: LINK_IDENTITY
  }
}
