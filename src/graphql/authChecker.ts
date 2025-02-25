import {AppContext} from './types';
import {AuthChecker} from 'type-graphql';

// create auth checker function
export const authChecker: AuthChecker<AppContext> = (
  {context},
  roles: string[]
) => {
  const user = context.getUser();

  if (roles.length === 0) {
    return user !== undefined;
  }
  if (!user) {
    return false;
  }

  if (roles.includes(user.role)) {
    return true;
  }

  return false;
};
