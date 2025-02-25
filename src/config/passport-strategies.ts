import bcrypt from 'bcryptjs';
import {GraphQLLocalStrategy} from 'graphql-passport';
import passport from 'passport';
import UserModel from '../users/models/users.model';
import User, {UserStatus} from '../users/models/users.schema';

type CallbackFn<T> = (err?: Error | null, ret?: T) => void;

const verifyFn = async (
  email: unknown,
  password: unknown,
  done: CallbackFn<User | null>
): Promise<void> => {
  console.log('we got in here to verify');
  const matchingUser: User | null = await UserModel.findOne({email});
  if (!matchingUser) {
    const error = new Error('Invalid email or password');
    done(error, null);
  } else {
    if (!matchingUser.password) {
      const error = new Error('Please try another login method');
      done(error, null);
    } else {
      const isMatch = await bcrypt.compare(
        password as string,
        matchingUser.password
      );
      const error = isMatch ? null : new Error('Invalid email or password');
      done(error, matchingUser);
    }
  }
};

passport.use(new GraphQLLocalStrategy(verifyFn));

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      _id?: string;
      email: string;
    }
  }
}

passport.serializeUser((user: Express.User, done) => {
  return done(null, user._id);
});

passport.deserializeUser((id: string, done) => {
  UserModel.findById(id, (_err: Error, user: Express.User) => {
    return done(null, user);
  });
});

export default passport;
