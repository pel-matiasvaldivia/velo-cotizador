import { Lead } from '../leads/leads.entity';
export declare class Cotizacion {
    id: string;
    leadId: string;
    lead: Lead;
    numeroCotizacion: string;
    division: 'vino' | 'cerveza' | 'industrial' | 'multiple';
    descripcionProyecto: string;
    nivelAutomatizacion: string;
    tipoInstalacion: string;
    totalEstimadoUsdMin: number;
    totalEstimadoUsdMax: number;
    tiempoFabricacionSemanas: number;
    requiereVisitaTecnica: boolean;
    prioridadComercial: string;
    estado: 'nueva' | 'revisada' | 'enviada' | 'en_negociacion' | 'ganada' | 'perdida' | 'archivada';
    aiResponse: any;
    pdfUrl: string;
    notasInternas: string;
    asignadoA: string;
    created_at: Date;
    updated_at: Date;
    items: CotizacionItem[];
}
export declare class CotizacionItem {
    id: string;
    cotizacionId: string;
    cotizacion: Cotizacion;
    descripcion: string;
    detalleTecnico: string;
    precioMinUsd: number;
    precioMaxUsd: number;
    tiempoFabricacionSemanas: number;
    orden: number;
}
