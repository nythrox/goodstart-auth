import {
  Injectable,
  Inject,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nest-pgpromise';
import { UserModel } from './user.model';
import { quoted } from '../../shared/utils/quoted';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersDao {
  constructor(
    @Inject(NEST_PGPROMISE_CONNECTION)
    private readonly pg: any,
  ) {}

  async findById(id: string): Promise<UserModel> {
    try {
      const user: any = await this.pg.one(
        'SELECT * FROM public.users WHERE user_id = ' + quoted(id),
      );
      return new UserModel({
        username: user.user_name,
        id: user.user_id,
        password: user.user_password,
        email: user.user_email,
        role: user.user_role,
      });
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async findByEmail(email: string): Promise<UserModel> {
    try {
      const user: any = await this.pg.one(
        'SELECT * FROM public.users WHERE user_email = ' + quoted(email),
      );
      return new UserModel({
        username: user.user_name,
        id: user.user_id,
        password: user.user_password,
        email: user.user_email,
        role: user.user_role,
      });
    } catch (e) {
      throw new HttpException('No account found.', HttpStatus.NOT_FOUND);
    }
  }

  async register(registerDto: RegisterDto): Promise<UserModel> {
    try {
      const user: any = await this.pg.one(`
      INSERT INTO public.users (user_name, user_email, user_password, user_role) 
      VALUES (${quoted(registerDto.name)},${quoted(registerDto.email)},${quoted(
        registerDto.password,
      )}, \'user\')
      RETURNING user_name, user_id, user_password, user_email, user_role;
      `);
      return new UserModel({
        username: user.user_name,
        id: user.user_id,
        password: user.user_password,
        email: user.user_email,
        role: user.user_role,
      });
    } catch (e) {
      if (e.constraint === 'users_user_name_key') {
        throw new HttpException(
          'Nome de usuário já em uso.',
          HttpStatus.BAD_REQUEST,
        );
      } else if (e.constraint === 'users_user_email_key') {
        throw new HttpException(
          'Email já em uso.',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw e;
    }
  }
}
