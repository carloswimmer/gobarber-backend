import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'joe@example.com',
      name: 'Joe Doe',
      password: '12341234',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      email: 'foo@example.com',
      name: 'Foo Bar',
    });

    expect(updatedUser.name).toEqual('Foo Bar');
    expect(updatedUser.email).toEqual('foo@example.com');
  });

  it('should not be able to update password with non-existent user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existent',
        email: 'foo@example.com',
        name: 'Foo Bar',
        old_password: 'wrong-old-password',
        password: '43214321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update with email of another user', async () => {
    await fakeUsersRepository.create({
      email: 'joe@example.com',
      name: 'Joe Doe',
      password: '12341234',
    });

    const user = await fakeUsersRepository.create({
      email: 'foo@example.com',
      name: 'Foo Bar',
      password: '12341234',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'joe@example.com',
        name: 'Foo Bar',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'joe@example.com',
      name: 'Joe Doe',
      password: '12341234',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      email: 'foo@example.com',
      name: 'Foo Bar',
      old_password: '12341234',
      password: '43214321',
    });

    expect(updatedUser.password).toEqual('43214321');
  });

  it('should not be able to update password without old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'joe@example.com',
      name: 'Joe Doe',
      password: '12341234',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'foo@example.com',
        name: 'Foo Bar',
        password: '43214321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'joe@example.com',
      name: 'Joe Doe',
      password: '12341234',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'foo@example.com',
        name: 'Foo Bar',
        old_password: 'wrong-old-password',
        password: '43214321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
