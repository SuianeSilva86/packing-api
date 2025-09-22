import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  // Accepts { username, password } and validates against UsersService
  async login(credentials: { username: string; password: string }) {
    if (!credentials || typeof credentials.username !== 'string' || credentials.username.length === 0) {
      throw new BadRequestException('username is required');
    }
    if (typeof credentials.password !== 'string' || credentials.password.length === 0) {
      throw new BadRequestException('password is required');
    }

    const valid = await this.usersService.validateCredentials(credentials.username, credentials.password);
    if (!valid) {
      throw new UnauthorizedException('invalid credentials');
    }

    const payload = { username: credentials.username };
    const secret = process.env.JWT_SECRET || 'changeme';
    return { access_token: this.jwtService.sign(payload, { secret }) };
  }
}
