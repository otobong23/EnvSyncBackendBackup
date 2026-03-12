import { IsNotEmpty, IsString } from "class-validator";

export class GitHubBodyDto {
  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsString()
  @IsNotEmpty()
  repo: string;
}