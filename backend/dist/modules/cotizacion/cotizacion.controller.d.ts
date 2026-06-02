import { CotizacionService } from './cotizacion.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
export declare class CotizacionController {
    private readonly cotizacionService;
    constructor(cotizacionService: CotizacionService);
    create(createDto: CreateCotizacionDto): Promise<import("./cotizacion.entity").Cotizacion | null>;
    findOne(id: string): Promise<import("./cotizacion.entity").Cotizacion | null>;
}
