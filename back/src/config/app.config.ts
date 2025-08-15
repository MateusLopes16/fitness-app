import { ConfigService } from '@nestjs/config';

export const appConfig = (configService: ConfigService) => ({
  port: configService.get<number>('PORT', 3000),
  apiPrefix: configService.get<string>('API_PREFIX', 'api/v1'),
  nodeEnv: configService.get<string>('NODE_ENV', 'development'),
  frontendUrl: configService.get<string>('FRONTEND_URL', 'http://localhost:4200'),
  throttle: {
    ttl: configService.get<number>('THROTTLE_TTL', 60),
    limit: configService.get<number>('THROTTLE_LIMIT', 100),
  },
});
