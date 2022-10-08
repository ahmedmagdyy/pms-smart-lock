import { Query, Resolver } from 'type-graphql';

@Resolver()
export class SmartLockResolver {
  @Query(() => String)
  async hello() {
    return 'Hello World!';
  }
}
