import { AuthChecker } from 'type-graphql';
import { AppContext } from '../lib/types';

export const customAuthChecker: AuthChecker<AppContext> = (
  { context },
  roles,
) => {
  if (!context.userId) {
    return false;
  }

  if (roles.length === 0) {
    return true;
  }

  return true;
};
