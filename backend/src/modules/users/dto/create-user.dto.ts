import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsIn(['admin', 'comercial'])
  rol?: 'admin' | 'comercial';
}
