import { Connection } from 'mongoose';

import { UserSchema } from './user.schema';
import { DATABASE_PROVIDER, USER_SCHEMA_PROVIDER } from '../../utils/constants';

export const usersProviders = [
  {
    provide: USER_SCHEMA_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: [DATABASE_PROVIDER],
  },
];
