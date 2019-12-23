import { Injectable, Global } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  get accessTokenSecret(): string {
    return String(this.envConfig.ACCESS_TOKEN_SECRET);
  }
  get accessTokenExpiresIn(): string {
    return String(this.envConfig.ACCESS_TOKEN_EXPIRES_IN);
  }
  get refreshTokenSecret(): string {
    return String(this.envConfig.REFRESH_TOKEN_SECRET);
  }
  get refreshTokenExpiresIn(): string {
    return String(this.envConfig.REFRESH_TOKEN_EXPIRES_IN);
  }
  get port(): number {
    return Number(this.envConfig.PORT);
  }
  get useDbConnectionUrl(): boolean {
    return Boolean(this.envConfig.USE_DB_CONNECTION_URL);
  }
  get dbConnectionUrl(): string {
    return String(this.envConfig.DB_CONNECTION_URL);
  }
  get dbPassword(): string {
    return String(this.envConfig.DB_PASSWORD);
  }
  get dbUser(): string {
    return String(this.envConfig.DB_USER);
  }
  get dbDatabase(): string {
    return String(this.envConfig.DB_DATABASE);
  }
  get dbPort(): number {
    return Number(this.envConfig.DB_PORT);
  }
  get dbHost(): string {
    return String(this.envConfig.DB_HOST);
  }
}
