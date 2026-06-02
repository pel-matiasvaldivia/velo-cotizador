import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsService } from './leads.service';
import { Lead } from './leads.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lead])],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
