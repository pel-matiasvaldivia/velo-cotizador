import { IsString, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateCotizacionDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  empresa?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  provincia?: string;

  @IsOptional()
  @IsString()
  como_conocio?: string;

  @IsString()
  descripcionProyecto: string;
}
