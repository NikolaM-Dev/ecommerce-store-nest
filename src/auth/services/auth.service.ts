import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/entities/user.entity';
import { PayloadToken } from '../models/token.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (user && (await compare(password, user.password))) return user;

    return null;
  }

  async generateJWT(user: User) {
    const payload: PayloadToken = { role: user.role, sub: user.id };

    return {
      acces_token: this.jwtService.sign(payload),
      user,
    };
  }
}
