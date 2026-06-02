export declare class PdfService {
    private readonly logger;
    generateCotizacionPdf(cotizacion: any): Promise<Buffer>;
    private generateHtml;
}
