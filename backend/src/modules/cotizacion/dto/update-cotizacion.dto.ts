import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateCotizacionDto {
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
  prioridadComercial?: string;

  @IsOptional()
  @IsString()
  asignadoA?: string;

  @IsOptional()
  @IsString()
  notasInternas?: string;
}
