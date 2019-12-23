import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class RegisterDto {
  
  @IsNotEmpty()
  public readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @Length(4)
  public readonly password: string;
}
