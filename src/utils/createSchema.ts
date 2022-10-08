import { buildSchema } from 'type-graphql';
import { SmartLockResolver } from '../modules/smartLock/smartLock';

export const createSchema = () =>
  buildSchema({
    resolvers: [SmartLockResolver],
  });
