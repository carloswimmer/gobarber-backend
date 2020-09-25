import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '@modules/users/infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async findById(user_id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === user_id);

    return findUser;
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid(), name, email, password });

    this.users.push(user);
    console.log(user);
    return user;
  }

  public async save(user: User): Promise<User> {
    const index = this.users.findIndex(item => item.id === user.id);

    this.users[index] = user;

    return user;
  }
}

export default FakeUsersRepository;
