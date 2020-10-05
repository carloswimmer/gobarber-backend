import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      email: 'joe@example.com',
      name: 'Joe Doe',
      password: '12341234',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create an user with existent email', async () => {
    await createUser.execute({
      email: 'joe@example.com',
      name: 'Joe Doe',
      password: '12341234',
    });

    await expect(
      createUser.execute({
        email: 'joe@example.com',
        name: 'Joe Doe',
        password: '12341234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
