import { IsIn, IsOptional, IsString } from 'class-validator';

export class QueryCotizacionDto {
  @IsOptional()
  @IsIn(['vino', 'cerveza', 'industrial', 'multiple'])
  division?: string;

  @IsOptional()
  @IsIn([
    'nueva',
    'revisada',
    'enviada',
    'en_negociacion',
    'ganada',
    'perdida',
    'archivada',
  ])
  estado?: string;

  @IsOptional()
  @IsIn(['alta', 'media', 'baja'])
  prioridad?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
