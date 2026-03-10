import { Expose, Type } from 'class-transformer';

export class UserDto {
  @Expose()
  _id: string;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  fullName: string;

  @Expose()
  nickname: string;

  @Expose()
  userName: string;

  @Expose()
  accessToken: string;

  @Expose()
  randomToken: string;

  @Expose()
  refreshToken: string;
}

export class user {
  @Expose()
  _id: string;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  fullName: string;

  @Expose()
  nickname: string;

  @Expose()
  randomToken: string;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}

export class LoginResponse {
  @Expose()
  @Type(() => user)
  result: user;

  @Expose()
  accessToken: string;
}

export class AllUserDto {
  @Expose()
  _id: string;

  @Expose()
  fullName: string;

  @Expose()
  nickname: string;

  @Expose()
  isEmailVerified: boolean;
}
