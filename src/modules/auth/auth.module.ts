import { Module, Provider } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';

const accessTokenJwtConfigsFactory: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService): JwtModuleOptions => {
    return {
      secret: configService.accessTokenSecret,
      signOptions: { expiresIn: configService.accessTokenExpiresIn },
    };
  },
  inject: [ConfigService],
};
const refreshTokenJwtConfigsFactory: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService): JwtModuleOptions => {
    return {
      secret: configService.refreshTokenSecret,
      signOptions: { expiresIn: configService.refreshTokenExpiresIn },
    };
  },
  inject: [ConfigService],
};

@Module({
  imports: [UsersModule, JwtModule.registerAsync(accessTokenJwtConfigsFactory), JwtModule.registerAsync(refreshTokenJwtConfigsFactory)],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
