import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { CotizacionService } from './cotizacion.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';

@Controller('cotizaciones')
export class CotizacionController {
  constructor(private readonly cotizacionService: CotizacionService) {}

  @Post()
  async create(@Body() createDto: CreateCotizacionDto) {
    return this.cotizacionService.create(createDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cotizacionService.findOne(id);
  }

  // Admin routes would go here (with auth)
}
