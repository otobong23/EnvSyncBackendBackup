import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDTO } from 'src/user/dto/create.user.dto';
import { LoginResponse } from 'src/user/dto/user.dto';
import { Serialize } from 'src/common/interceptor/custom.interceptor';
import { LoginUserDTO } from './dto/login.user.dto';
import { ForgetPasswordDto, RequestOtpDto, ResetPasswordDto, VerifyForgetPasswordDto } from './dto/auth.dto';
import { ENVIRONMENT } from 'src/common/constant/enivronment/enviroment';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  async create(@Body() body: CreateUserDTO) {
    return await this.authService.create(body);
  }

  // @Serialize(UserDto)
  @Serialize(LoginResponse)
  @Post('login')
  async login(@Body() body: LoginUserDTO) {
    return await this.authService.login(body);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() payload: ForgetPasswordDto) {
    return await this.authService.forgotPassword(payload);
  }

  @Post('verify-reset-password-otp')
  async verifyPasswordOtp(@Body() payload: VerifyForgetPasswordDto) {
    return await this.authService.verifyPasswordOtp(payload);
  }

  @Post('reset-password')
  async resetPassword(@Body() payload: ResetPasswordDto) {
    return await this.authService.resetPassword(payload);
  }

  @Post('request-otp')
  async requestOtp(@Body() payload: RequestOtpDto) {
    return await this.authService.requestOtp(payload);
  }

  //@UseGuards(AuthGuard)
  @Get('refresh-token/:randomToken')
  async refreshToken(@Param('randomToken') randomToken: string) {
    return await this.authService.refreshToken(randomToken);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() { }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req, @Res() res) {
    const { accessToken } = await this.authService.githubAuth(req.user);
    return res.redirect(`${ENVIRONMENT.WEB.ORIGIN}/auth/success?token=${accessToken}`);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res) {
    const { accessToken } = await this.authService.googleAuth(req.user);
    return res.redirect(`${ENVIRONMENT.WEB.ORIGIN}/auth/success?token=${accessToken}`);
  }
}
