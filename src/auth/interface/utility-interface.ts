export interface auth {
  email: string;
  fullName: string;
  profilePic: string;
}

export interface googleAuth extends auth {
  sub: string;
}

export interface githubAuth extends auth {
  profileId: string;
  accessToken: string;
}