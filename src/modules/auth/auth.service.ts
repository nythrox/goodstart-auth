import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../users/user.model';
import { AccessTokenPayload } from './jwt-payload.interface';
import { RefreshDto } from './dto/refresh.dto';
import { RefreshToken } from './models/refresh-token.model';
import { RefreshTokenPayload } from './models/refresh-token-payload.model';
import { ConfigService } from '../config/config.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly accessTokenJwtService: JwtService,
    private readonly refreshTokenJwtService: JwtService,
  ) {}

  async refresh(refreshDto: RefreshDto): Promise<any> {
    const refreshToken: RefreshToken = await this.validateRefreshToken(
      refreshDto.refreshToken,
    );
    const newAccessToken: string = this.generateNewAccessToken(
      await this.usersService.findById(refreshToken.sub),
    );
    return {
      'accessToken': newAccessToken,
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const user: UserModel = await this.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return {
      'accessToken': this.generateNewAccessToken(user),
      'refreshToken': this.generateNewRefreshToken(user),
      'user': user,
    };
  }

  async register(regiserDto: RegisterDto): Promise<any> {
    const user: UserModel = await this.usersService.registerUser(regiserDto);
    return {
      'accessToken': this.generateNewAccessToken(user),
      'refreshToken': this.generateNewRefreshToken(user),
      'user': user,
    };
  }

  async validateUser(email: string, pass: string): Promise<UserModel> {
    const user: UserModel = await this.usersService.findByEmail(email);
    if (user && user.password === pass) {
      return user;
    } else {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  generateNewAccessToken(user: UserModel): string {
    const payload: AccessTokenPayload = {
      'sub': user.id,
      'username': user.username,
      'x-hasura-claims': {
        'x-hasura-allowed-roles': ['admin', 'user', 'anon'],
        'x-hasura-default-role': 'anon',
        'x-hasura-user-id': user.id,
        'x-hasura-role': user.role,
      },
    };
    const token: string = this.accessTokenJwtService.sign(payload);
    return token;
  }

  generateNewRefreshToken(user: UserModel): string {
    const payload: RefreshTokenPayload = {
      sub: user.id,
    };
    const token: string = this.refreshTokenJwtService.sign(payload);
    return token;
  }

  async validateRefreshToken(
    encodedRefreshToken: string,
  ): Promise<RefreshToken> {
    const refreshToken: RefreshToken = this.refreshTokenJwtService.verify<
      RefreshToken
    >(encodedRefreshToken, {
      ignoreExpiration: true,
    });
    if (!refreshToken) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
    return refreshToken;
  }
}
