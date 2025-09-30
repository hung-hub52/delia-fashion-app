// src/modules/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret',   // <-- NHỚ set .env
    });
  }

  // payload do ta ký ở auth.service: { sub, role, email }
  async validate(payload: any) {
    // Giá trị gắn vào req.user
    return {
      sub: payload.sub,
      id: payload.sub,
      userId: payload.sub,
      id_nguoidung: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
