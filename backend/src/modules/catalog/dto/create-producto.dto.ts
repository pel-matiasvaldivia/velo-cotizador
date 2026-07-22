import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductoDto {
  @IsIn(['vino', 'cerveza', 'industrial', 'multiple'])
  division: 'vino' | 'cerveza' | 'industrial' | 'multiple';

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsString()
  @MinLength(2)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  unidad?: string;

  @IsNumber()
  @Min(0)
  costoBaseUsd: number;

  @IsNumber()
  @Min(0)
  margenPct: number;

  @IsOptional()
  @IsObject()
  especificaciones?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
