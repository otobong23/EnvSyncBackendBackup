import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ENVIRONMENT } from 'src/common/constant/enivronment/enviroment';
import { HashData } from 'src/common/hashed/hashed.data';
import { UpdateUserDTO } from './dto/update.user.dto';
import { AuthProvider } from './enum/auth-provider.enum';
import { OtpType } from 'src/otp/enum/opt.type.enum';
import { OtpService } from 'src/otp/service/otp.service';

@Injectable()
export class UserService {
   constructor(
      @InjectModel(User.name) private userModel: Model<User>,
      private jwtService: JwtService,
      private otpService: OtpService
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

   /**
   * Updates a user's profile.
   */
   async updateUserProfile(updateData: UpdateUserDTO, user: User) {
      try {
         const updatedUser = await this.userModel.findByIdAndUpdate(
            user._id.toString(),
            { ...updateData },
            { new: true },
         );

         if (!updatedUser) {
            return { message: 'User not found or update failed.' };
         }

         return {
            message: `Profile successfully updated with the following changes: ${JSON.stringify(updateData)}`,
            updatedUser,
         };
      } catch (error) {
         return { message: `An error occurred during update: ${error.message}` };
      }
   }

   /**
    * Retrieves a user by their ID.
    */
   async findUserById(id: string): Promise<User> {
      const user = await this.userModel.findById(id);
      if (!user) {
         throw new NotFoundException('User not found');
      }
      return user;
   }

   /**
    * Finds a user by a random token.
    */
   async findUserByToken(randomToken: string): Promise<User> { // questionable service
      const user = await this.userModel.findOne({ randomToken });
      if (!user) {
         throw new NotFoundException('User not found');
      }
      return user;
   } 

   /**
    * Finds a user by email.
    */
   async findUserByEmail(email: string): Promise<User> {
      const user = await this.userModel.findOne({ email });
      if (!user) {
         throw new NotFoundException('User not found');
      }
      return user;
   }

   /**
    * Suspends a user.
    */
   async suspendUserAccount(userId: string) {
      return this.userModel.findOneAndUpdate(
         { _id: userId },
         { isSuspended: true },
         { new: true },
      );
   }

   /**
    * Removes suspension from a user.
    */
   async unsuspendUserAccount(userId: string) {
      return this.userModel.findOneAndUpdate(
         { _id: userId },
         { isSuspended: false },
         { new: true },
      );
   }

   /**
   * Registers a new user, hashes their password, and sends an OTP for email verification.
   */
   async registerUser(payload: Partial<User>) {
      const { password } = payload;

      if(!password) throw new ConflictException('Password Not found in payload');
      let hashedPassword = await HashData(password);

      const newUser = await this.userModel.create({
         ...payload,
         password: hashedPassword,
      });

      const tokenData = await this.generateAuthTokens(newUser);
      newUser.refreshToken = tokenData.refreshToken;
      await newUser.save();

       await this.otpService.sendOtp({
         email: newUser.email,
         type: OtpType.EMAIL_VERIFICATION,
       });

      delete newUser['_doc'].password;
      return { newUser, accessToken: tokenData.accessToken };
   }

   async registerGoogleUser(dto: Partial<User>) {
      const googleUser = await this.userModel.create({
         ...dto,
      });
      const token = await this.generateAuthTokens(googleUser);
      googleUser.refreshToken = token.refreshToken;
      googleUser.isEmailVerified = true;
      googleUser.provider = 'google' as AuthProvider;
      await googleUser.save();
      return { googleUser, accessToken: token.accessToken };
   }

   async registerGithubUser(dto: Partial<User>) {
      const githubUser = await this.userModel.create({
         ...dto,
      });
      const token = await this.generateAuthTokens(githubUser);
      githubUser.refreshToken = token.refreshToken;
      githubUser.isEmailVerified = true;
      githubUser.provider = 'github' as AuthProvider;
      await githubUser.save();
      return { githubUser, accessToken: token.accessToken };
   }
}
