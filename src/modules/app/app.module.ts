import { Module } from '@nestjs/common';
import { NestPgpromiseModule } from 'nest-pgpromise';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';
import { AuthModule } from '../auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { UncaughtExceptionFilter } from '../../shared/filters/uncaught-exception.filter';

const pgPromiseFactory = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    if (configService.useDbConnectionUrl) {
      return {
        connection: configService.dbConnectionUrl,
      };
    } else {
      return {
        connection: {
          host: configService.dbHost,
          port: configService.dbPort,
          database: configService.dbDatabase,
          user: configService.dbUser,
          password: configService.dbPassword,
          ssl: true,
        },
      };
    }
  },
  inject: [ConfigService],
};

@Module({
  imports: [NestPgpromiseModule.registerAsync(pgPromiseFactory), AuthModule],
  providers: [
    // {
    //   provide: APP_FILTER,
    //   useClass: UncaughtExceptionFilter,
    // },
  ],
})
export class AppModule {}
