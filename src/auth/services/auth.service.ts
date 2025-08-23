import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }

  async login(username: string, password: string) {
    const payload = { username, sub: 1 };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
