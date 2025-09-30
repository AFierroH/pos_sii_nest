import { PrismaService } from '../prisma.service';
export declare class VentaService {
    private prisma;
    constructor(prisma: PrismaService);
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
    createVenta(data: any): Promise<{
        id_venta: number;
        fecha: Date;
        total: number;
        id_usuario: number;
        id_empresa: number;
    }>;
    ventasPorFecha(inicio: string, fin: string): Promise<{
        fecha: Date;
        total: number;
    }[]>;
    ticketPromedio(): Promise<number>;
}
