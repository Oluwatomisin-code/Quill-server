import bcrypt from 'bcryptjs';
import {GraphQLLocalStrategy} from 'graphql-passport';
import passport from 'passport';
import UserModel from '../users/models/users.model';
import User from '../users/models/users.schema';

type CallbackFn<T> = (err?: Error | null, ret?: T) => void;

const verifyFn = async (
  email: unknown,
  password: unknown,
  done: CallbackFn<User | null>
): Promise<void> => {
  console.log('Starting login verification for email:', email);
  const matchingUser: User | null = await UserModel.findOne({email});
  if (!matchingUser) {
    console.log('No user found for email:', email);
    const error = new Error('Invalid email or password');
    done(error, null);
  } else {
    if (!matchingUser.password) {
      console.log('User found but no password set for email:', email);
      const error = new Error('Please try another login method');
      done(error, null);
    } else {
      const isMatch = await bcrypt.compare(
        password as string,
        matchingUser.password
      );
      console.log('Password match result:', isMatch, 'for email:', email);
      const error = isMatch ? null : new Error('Invalid email or password');
      done(error, isMatch ? matchingUser : null);
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
  console.log('Serializing user:', user._id);
  return done(null, user._id);
});

passport.deserializeUser((id: string, done) => {
  console.log('Deserializing user:', id);
  UserModel.findById(id, (_err: Error, user: Express.User) => {
    console.log('Deserialized user result:', user ? 'found' : 'not found');
    return done(null, user);
  });
});

export default passport;
