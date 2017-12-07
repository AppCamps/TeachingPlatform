import { APPLICATION_BOOTED, APPLICATION_STATE_RESET } from '../constants/application';

export function applicationBooted() {
  return {
    type: APPLICATION_BOOTED,
  };
}

export function resetApplicationState() {
  return {
    type: APPLICATION_STATE_RESET,
  };
}
