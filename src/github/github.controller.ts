import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ConflictException } from '@nestjs/common';
import { GithubService } from './github.service';
import { CreateGithubDto } from './dto/create-github.dto';
import { UpdateGithubDto } from './dto/update-github.dto';
import { JWTAuthGuard } from 'src/auth/customGuard/jwt.guard';
import { UserService } from 'src/user/user.service';

@UseGuards(JWTAuthGuard)
@Controller('github')
export class GithubController {
  private userService: UserService;
  constructor(private readonly githubService: GithubService) {}

  @Get('repos')
  async getRepos(@Req() req) {
    const user = await this.userService.findUserById(req.user.id);
    if(!user.providerToken) throw new ConflictException('User GitHub Account Not Linked Yet, Please Link Your GitHub Account')
    return this.githubService.getUserRepos(user.providerToken);
  }
}
