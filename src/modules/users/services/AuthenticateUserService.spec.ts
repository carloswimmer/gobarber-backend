import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      email: 'joe@example.com',
      name: 'Joe Doe',
      password: '12341234',
    });

    const response = await authenticateUser.execute({
      email: 'joe@example.com',
      password: '12341234',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'foo@example.com',
        password: '12341234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with non matching password', async () => {
    await fakeUsersRepository.create({
      email: 'joe@example.com',
      name: 'Joe Doe',
      password: '12341234',
    });

    await expect(
      authenticateUser.execute({
        email: 'joe@example.com',
        password: 'wrong-passoword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
