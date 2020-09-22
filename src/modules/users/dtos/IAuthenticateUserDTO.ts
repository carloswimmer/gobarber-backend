import User from '../infra/typeorm/entities/User';

export default interface IAuthenticateUserDTO {
  user: User;
  token: string;
}
