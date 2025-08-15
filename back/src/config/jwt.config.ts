import { ConfigService } from '@nestjs/config';

export const jwtConfig = (configService: ConfigService) => ({
  secret: configService.get<string>('JWT_SECRET'),
  signOptions: {
    expiresIn: configService.get<string>('JWT_EXPIRES_IN', '15m'),
  },
  refreshSecret: configService.get<string>('JWT_REFRESH_SECRET'),
  refreshExpiresIn: configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
});
