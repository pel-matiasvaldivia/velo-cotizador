import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './leads.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  async findAll() {
    return this.leadRepository.find({
      order: { created_at: 'DESC' },
      relations: { cotizaciones: true },
    });
  }

  async findOne(id: string) {
    return this.leadRepository.findOne({
      where: { id },
      relations: { cotizaciones: true },
    });
  }
}
