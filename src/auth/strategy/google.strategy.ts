import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ENVIRONMENT } from 'src/common/constant/enivronment/enviroment';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: ENVIRONMENT.GOOGLE.CLIENT_ID,
      clientSecret: ENVIRONMENT.GOOGLE.CLIENT_SECRET,
      callbackURL: ENVIRONMENT.GOOGLE.CALLBACK,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { name, emails, photos } = profile;
    console.log(profile)
    const user = {
      email: emails[0].value,
      fullName: `${name.givenName} ${name.familyName}`,
      profilePic: photos[0].value,
      sub: profile.sub,
      accessToken,
    };

    done(null, user);
  }
}
