// src/common/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // DÙNG CHUNG 1 SECRET với JwtModule
      secretOrKey: process.env.JWT_SECRET || 'secret-key',
    });
  }

  async validate(payload: any) {
    // payload do AuthService.sign() cấp: { sub, role, email }
    return {
      sub: payload.sub,
      id: payload.sub,
      userId: payload.sub,
      id_nguoidung: payload.sub,
      role: payload.role,
      email: payload.email,
    };
  }
}
