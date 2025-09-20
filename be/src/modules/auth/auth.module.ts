import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailerModule } from '@nestjs-modules/mailer';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/entities/user.entity';
import { OtpRequest } from './entities/otp.entity';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';

@Module({
  imports: [
    // ĐĂNG KÝ REPO Ở ĐÂY
    TypeOrmModule.forFeature([User, OtpRequest]),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret-key',
      signOptions: { expiresIn: '7d' },
    }),
    PassportModule,

    // Nếu MailerModule chỉ forRoot ở AppModule (KHÔNG isGlobal)
    // bạn CẦN import MailerModule ở đây để inject MailerService
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
