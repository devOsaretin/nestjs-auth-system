import { Controller, Post, Get } from '@nestjs/common';

@Controller()
export class AuthController {
  @Post('register')
  async register() {
    return 'register';
  }

  @Post('login')
  async login() {
    return 'login';
  }

  @Get('users/me')
  async getAuthClient() {
    return 'auth user';
  }
}
