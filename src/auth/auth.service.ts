import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from 'src/user/dto/create.user.dto';

@Injectable()
export class AuthService {
   constructor(
      private userService: UserService,
      private jwt: JwtService,
   ) { }

   //sign up account endpoint
   async create(body: CreateUserDTO) {
      const { email } = body;
      const userExist = await this.userService.checkIfUserExists(email);

      if (userExist) {
         if (userExist.email === email) {
            throw new UnprocessableEntityException('Email already exists');
         }
      }

      return await this.userService.registerUser(body);
   }
}
