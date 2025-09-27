import { VentaService } from './venta.service';
export declare class VentaController {
    private readonly ventaService;
    constructor(ventaService: VentaService);
    getAll(): import("@prisma/client").Prisma.PrismaPromise<({
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
    create(data: any): import("@prisma/client").Prisma.Prisma__ventaClient<{
        id_empresa: number;
        id_usuario: number;
        id_venta: number;
        fecha: Date;
        total: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
