import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create.user.dto';
import { Exclude } from 'class-transformer';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @Exclude()
  password: string;

  @Exclude()
  email: string;
}
