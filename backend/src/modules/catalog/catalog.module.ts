import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { Producto } from './producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto])],
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
