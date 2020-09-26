import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update an avatar', async () => {
    const user = await fakeUsersRepository.create({
      email: 'joe@example.com',
      name: 'Joe Doe',
      password: '12341234',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'joe_doe_avatar.jpg',
    });

    expect(user.avatar).toEqual('joe_doe_avatar.jpg');
  });

  it('should not be able to update a non existent user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existent',
        avatarFilename: 'joe_doe_avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when update a new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      email: 'joe@example.com',
      name: 'Joe Doe',
      password: '12341234',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'joe_doe_avatar.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'joe_doe_new_avatar.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('joe_doe_avatar.jpg');
    expect(user.avatar).toEqual('joe_doe_new_avatar.jpg');
  });
});
