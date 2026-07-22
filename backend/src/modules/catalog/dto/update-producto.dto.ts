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

export class UpdateProductoDto {
  @IsOptional()
  @IsIn(['vino', 'cerveza', 'industrial', 'multiple'])
  division?: 'vino' | 'cerveza' | 'industrial' | 'multiple';

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  unidad?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costoBaseUsd?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  margenPct?: number;

  @IsOptional()
  @IsObject()
  especificaciones?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
