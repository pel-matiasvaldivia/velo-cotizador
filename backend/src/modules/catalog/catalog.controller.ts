import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('productos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  // Comercial y admin pueden consultar el catálogo.
  @Get()
  findAll(
    @Query('division') division?: string,
    @Query('search') search?: string,
    @Query('activo') activo?: string,
  ) {
    return this.catalogService.findAll({
      division,
      search,
      activo: activo === undefined ? undefined : activo === 'true',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogService.findOne(id);
  }

  // Solo admin gestiona costos, márgenes y altas/bajas.
  @Post()
  @Roles('admin')
  create(@Body() dto: CreateProductoDto) {
    return this.catalogService.create(dto);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateProductoDto) {
    return this.catalogService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.catalogService.remove(id);
  }
}
