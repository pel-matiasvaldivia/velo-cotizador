import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

export interface ProductoView extends Producto {
  precioVentaUsd: number;
}

export interface FindProductosQuery {
  division?: string;
  search?: string;
  activo?: boolean;
}

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  // Precio de venta derivado del costo + margen.
  private withPrecio(p: Producto): ProductoView {
    const costo = Number(p.costoBaseUsd) || 0;
    const margen = Number(p.margenPct) || 0;
    const precioVentaUsd = Math.round(costo * (1 + margen / 100) * 100) / 100;
    return { ...p, precioVentaUsd };
  }

  async findAll(query: FindProductosQuery = {}): Promise<ProductoView[]> {
    const where: FindOptionsWhere<Producto> = {};
    if (query.division) where.division = query.division as Producto['division'];
    if (query.activo !== undefined) where.activo = query.activo;
    if (query.search) where.nombre = ILike(`%${query.search}%`);

    const productos = await this.productoRepository.find({
      where,
      order: { division: 'ASC', nombre: 'ASC' },
    });
    return productos.map((p) => this.withPrecio(p));
  }

  async findOne(id: string): Promise<ProductoView> {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return this.withPrecio(producto);
  }

  async create(dto: CreateProductoDto): Promise<ProductoView> {
    const producto = this.productoRepository.create(dto);
    const saved = await this.productoRepository.save(producto);
    return this.withPrecio(saved);
  }

  async update(id: string, dto: UpdateProductoDto): Promise<ProductoView> {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    Object.assign(producto, dto);
    const saved = await this.productoRepository.save(producto);
    return this.withPrecio(saved);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const result = await this.productoRepository.delete(id);
    if (!result.affected) throw new NotFoundException('Producto no encontrado');
    return { deleted: true };
  }
}
