import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModule,],
  controllers: [GithubController],
  providers: [GithubService, JwtService],
})
export class GithubModule {}
