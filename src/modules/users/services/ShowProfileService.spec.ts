import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'joe@example.com',
      name: 'Joe Doe',
      password: '12341234',
    });

    const userProfile = await showProfile.execute({
      user_id: user.id,
    });

    expect(userProfile.name).toEqual('Joe Doe');
    expect(userProfile.email).toEqual('joe@example.com');
  });

  it('should not be able to show profile of a non-existent user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existent',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
