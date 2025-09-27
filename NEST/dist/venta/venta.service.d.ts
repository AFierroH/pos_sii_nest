import { PrismaService } from '../prisma.service';
export declare class VentaService {
    private prisma;
    constructor(prisma: PrismaService);
    getVentas(): import("@prisma/client").Prisma.PrismaPromise<({
        detalles: {
            id_venta: number;
            id_detalle: number;
            id_producto: number;
            cantidad: number;
            precio_unitario: number;
            subtotal: number;
        }[];
    } & {
        id_empresa: number;
        id_usuario: number;
        id_venta: number;
        fecha: Date;
        total: number;
    })[]>;
    createVenta(data: any): import("@prisma/client").Prisma.Prisma__ventaClient<{
        id_empresa: number;
        id_usuario: number;
        id_venta: number;
        fecha: Date;
        total: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
