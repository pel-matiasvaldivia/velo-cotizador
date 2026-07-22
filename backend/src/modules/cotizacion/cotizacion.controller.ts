import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CotizacionService } from './cotizacion.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { QueryCotizacionDto } from './dto/query-cotizacion.dto';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cotizaciones')
export class CotizacionController {
  constructor(private readonly cotizacionService: CotizacionService) {}

  // ---- Público: el cliente solicita una cotización ----
  @Post()
  async create(@Body() createDto: CreateCotizacionDto) {
    return this.cotizacionService.create(createDto);
  }

  // ---- Portal comercial (requiere autenticación) ----
  @UseGuards(JwtAuthGuard)
  @Get('admin/stats')
  async stats() {
    return this.cotizacionService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: QueryCotizacionDto) {
    return this.cotizacionService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cotizacionService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCotizacionDto) {
    return this.cotizacionService.update(id, dto);
  }
}
