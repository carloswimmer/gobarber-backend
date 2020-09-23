import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(fakeUsersRepository);

    const user = await createUser.execute({
      email: 'joe@example.com',
      name: 'Joe Doe',
      password: '12341234',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create an user with existent email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(fakeUsersRepository);

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
