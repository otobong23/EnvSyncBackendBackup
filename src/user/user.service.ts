import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ENVIRONMENT } from 'src/common/constant/enivronment/enviroment';
import { HashData } from 'src/common/hashed/hashed.data';

@Injectable()
export class UserService {
   constructor(
      @InjectModel(User.name) private userModel: Model<User>,
      private jwtService: JwtService,
   ) { }

   /**
   * Generates authentication tokens (access and refresh tokens) for a user.
   */
   async generateAuthTokens(user: User) {
      const payload = {
         _id: user._id.toString(),
         fullName: user.fullName,
         email: user.email,
      };

      const [accessToken, refreshToken] = await Promise.all([
         this.jwtService.signAsync(payload, {
            secret: ENVIRONMENT.JWT.JWT_SECRET,
            expiresIn: ENVIRONMENT.JWT.EXPIRATION_TIME as any,
         }),
         this.jwtService.signAsync(payload, {
            secret: ENVIRONMENT.JWT.JWT_REFRESH_SECRET,
            expiresIn: ENVIRONMENT.JWT.JWT_REFRESH_EXP_TIME as any,
         }),
      ]);

      return { accessToken, refreshToken };
   }

   /**
  * Registers a new user, hashes their password, and sends an OTP for email verification.
  */
   async registerUser(payload: Partial<User>) {
      const { password } = payload;

      let hashedPassword;
      if (password) hashedPassword = await HashData(password);

      const newUser = await this.userModel.create({
         ...payload,
         password: hashedPassword,
      });

      const tokenData = await this.generateAuthTokens(newUser);
      newUser.refreshToken = tokenData.refreshToken;
      newUser.accessToken = tokenData.accessToken;
      await newUser.save();

      //  await this.otpService.sendOtp({
      //    email: newUser.email,
      //    type: OtpType.EMAIL_VERIFICATION,
      //  });

      delete newUser['_doc'].password;
      return { newUser, accessToken: tokenData.accessToken };
   }

   /**
   * Fetches all users from the database.
   */
   async fetchAllUsers(): Promise<User[]> {
      return this.userModel.find();
   }

   /**
    * Finds a user by email or username.
    */
   async checkIfUserExists(email?: string): Promise<User | null> {
      if (!email) {
         throw new Error('Either email or username must be provided');
      }

      return this.userModel.findOne({ email }).exec();
   }
}
