import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login using phone number (and password if already set)' })
  async login(@Body() body: { phone: string; password?: string }) {
    return this.authService.login(body.phone, body.password);
  }

  @Post('set-password')
  @ApiOperation({ summary: 'Set password after first login' })
  async setPassword(@Body() body: { phone: string; newPassword: string }) {
    return this.authService.setPassword(body.phone, body.newPassword);
  }
}
