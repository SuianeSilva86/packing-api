import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login demo, receives { username } and returns a JWT token' })
  @ApiResponse({ status: 201, description: 'Returns an access token' })
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
