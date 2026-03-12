import { Controller, Get, Post, Body, UseGuards, Req, ConflictException } from '@nestjs/common';
import { GithubService } from './github.service';
import { JWTAuthGuard } from 'src/auth/customGuard/jwt.guard';
import { UserService } from 'src/user/user.service';
import { GitHubBodyDto } from './dto/github.dto';

@Controller('github')
export class GithubController {
  private userService: UserService;
  constructor(private readonly githubService: GithubService) { }

  @UseGuards(JWTAuthGuard)
  @Get('repos')
  async repos(@Req() req) {
    const user = await this.userService.findUserById(req.user.id);
    if (!user.providerToken) throw new ConflictException('User GitHub Account Not Linked Yet, Please Link Your GitHub Account')
    return this.githubService.getUserRepos(user.providerToken);
  }

  @UseGuards(JWTAuthGuard)
  @Get('get-repo')
  async getRepo(
    @Req() req,
    @Body() body: GitHubBodyDto,
  ) {
    const { owner, repo } = body
    const user = await this.userService.findUserById(req.user.id);
    if (!user.providerToken) throw new ConflictException('User GitHub Account Not Linked Yet, Please Link Your GitHub Account');
    return this.githubService.getRepo(user.providerToken, owner, repo)
  }


  
  //WebHooking the repo
  @UseGuards(JWTAuthGuard)
  @Post("connect-repo")
  async connectRepo(
    @Req() req,
    @Body() body: GitHubBodyDto,
  ) {
    const user = await this.userService.findUserById(req.user.id);
    if (!user.providerToken) throw new ConflictException('User GitHub Account Not Linked Yet, Please Link Your GitHub Account')

    const webhook = await this.githubService.createWebhook(
      user.providerId,
      body.owner,
      body.repo,
    );

    return {
      message: "Repository connected",
      webhookId: webhook.id,
    };
  }

  @Post("webhook")
  async handleWebhook(@Req() req) {

    const event = req.headers["x-github-event"];

    if (event === "push") {
      console.log("Push detected:", req.body.repository.full_name);
    }

    if (event === "pull_request") {
      console.log("PR event:", req.body.action);
    }

    return { received: true };
  }
}
