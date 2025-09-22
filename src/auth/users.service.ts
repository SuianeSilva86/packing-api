import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

export type UserRecord = { username: string; passwordHash: string };

@Injectable()
export class UsersService {
  private users: UserRecord[] = [];

  constructor(private readonly configService: ConfigService) {
    // Seed a demo user using ADMIN_PASSWORD strictly from .env
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    const adminPasswordHash = this.configService.get<string>('ADMIN_PASSWORD_HASH');
    const adminUsername = this.configService.get<string>('ADMIN_USERNAME');

    if (!adminUsername || adminUsername.length === 0) {
      throw new Error('ADMIN_USERNAME must be set in environment');
    }

    let hash: string | undefined = undefined;

    if (adminPasswordHash && adminPasswordHash.length > 0) {
      hash = adminPasswordHash;
    } else {
      if (!adminPassword || adminPassword.length < 8) {
        throw new Error('ADMIN_PASSWORD must be set in environment and be at least 8 characters long unless ADMIN_PASSWORD_HASH is provided');
      }
      const saltRounds = 10;
      hash = bcrypt.hashSync(adminPassword, saltRounds);
    }

    this.users.push({ username: adminUsername, passwordHash: hash });
  }

  async findByUsername(username: string): Promise<UserRecord | undefined> {
    return this.users.find((u) => u.username === username);
  }

  async validateCredentials(username: string, password: string): Promise<boolean> {
    const user = await this.findByUsername(username);
    if (!user) return false;
    return bcrypt.compare(password, user.passwordHash);
  }
}
