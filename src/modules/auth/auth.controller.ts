import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto): Promise<any> {
    return this.authService.refresh(refreshDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    return this.authService.register(registerDto);
  }
  
}
