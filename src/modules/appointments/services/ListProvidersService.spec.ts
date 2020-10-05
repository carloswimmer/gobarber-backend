import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list all providers', async () => {
    const user1 = await fakeUsersRepository.create({
      email: 'joe@example.com',
      name: 'Joe Doe',
      password: '12341234',
    });

    const user2 = await fakeUsersRepository.create({
      email: 'foo@example.com',
      name: 'Foo Bar',
      password: '12341234',
    });

    const loggedUser = await fakeUsersRepository.create({
      email: 'mary@example.com',
      name: 'Mary Doe',
      password: '12341234',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
