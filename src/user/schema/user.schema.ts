import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AuthProvider } from '../enum/auth-provider.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ type: String })
  nickname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String })
  accessToken?: string;

  @Prop({ type: String })
  randomToken?: string;

  @Prop({ type: String })
  refreshToken?: string;

  @Prop({ required: false })
  password: string;

  @Prop({ type: Boolean, default: false })
  isSuspended: boolean;

  @Prop({
    type: String,
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
    nullable: false,
  })
  provider: AuthProvider;

  @Prop({ type: String })
  providerId: string

  @Prop({ default: null })
  profilePic?: string;

  @Prop({ default: null })
  profilePicPublicId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
