import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ENVIRONMENT } from 'src/common/constant/enivronment/enviroment';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: ENVIRONMENT.GITHUB.CLIENT_ID,
      clientSecret: ENVIRONMENT.GITHUB.CLIENT_SECRET,
      callbackURL: ENVIRONMENT.GITHUB.CALLBACK,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    profile: any,
    done: Function,
  ) {
    const fullName = profile._json?.name || profile.username;
    console.log(profile)

    const user = {
      provider: 'github',
      profileId: profile.id,
      fullName,
      email: profile.emails?.[0]?.value || null,
      accessToken,
      profilePic: profile._json?.avatar_url || null,
    };

    done(null, user);
  }
}
