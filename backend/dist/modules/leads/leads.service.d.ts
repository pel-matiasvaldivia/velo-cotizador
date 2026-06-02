import { Repository } from 'typeorm';
import { Lead } from './leads.entity';
export declare class LeadsService {
    private leadRepository;
    constructor(leadRepository: Repository<Lead>);
    findAll(): Promise<Lead[]>;
    findOne(id: string): Promise<Lead | null>;
}
