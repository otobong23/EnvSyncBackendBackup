import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { configDotenv } from 'dotenv';
import { PassportModule } from '@nestjs/passport';
// import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { GithubModule } from './github/github.module';

configDotenv()

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_DB'),
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({
      storage: memoryStorage(),
      limits: { fileSize: 4 * 1024 * 1024 },
    }),
    PassportModule,
    AuthModule,
    UserModule,
    ProjectModule,
    GithubModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
