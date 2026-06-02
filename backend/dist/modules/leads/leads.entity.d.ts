import { Cotizacion } from '../cotizacion/cotizacion.entity';
export declare class Lead {
    id: string;
    nombre: string;
    empresa: string;
    email: string;
    telefono: string;
    provincia: string;
    como_conocio: string;
    canal: 'web' | 'whatsapp';
    created_at: Date;
    updated_at: Date;
    cotizaciones: Cotizacion[];
}
