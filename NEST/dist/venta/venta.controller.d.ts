import { VentaService } from './venta.service';
import { DteService } from '../dte/dte.service';
export declare class VentaController {
    private ventaService;
    private dteService;
    constructor(ventaService: VentaService, dteService: DteService);
    getVentas(): Promise<({
        detalles: {
            id_detalle: number;
            id_venta: number;
            id_producto: number;
            cantidad: number;
            precio_unitario: number;
            subtotal: number;
        }[];
    } & {
        id_venta: number;
        fecha: Date;
        total: number;
        id_usuario: number;
        id_empresa: number;
    })[]>;
    crearVenta(payload: any): Promise<{
        id_venta: number;
        fecha: Date;
        total: number;
        id_usuario: number;
        id_empresa: number;
    }>;
    emitirDte(payload: any): Promise<{
        printer: string;
        data: string[];
    }>;
    ventasPorFecha(inicio: string, fin: string): Promise<{
        fecha: Date;
        total: number;
    }[]>;
    ticketPromedio(): Promise<number>;
}
