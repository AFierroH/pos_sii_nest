import { PrismaService } from '../prisma.service';
export declare class DteService {
    private prisma;
    constructor(prisma: PrismaService);
    emitirDte(data: any): Promise<{
        printer: string;
        data: {
            type: string;
            format: string;
            data: string;
        }[];
    }>;
    productosMasVendidos(): Promise<(import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.Detalle_ventaGroupByOutputType, "id_producto"[]> & {
        _sum: {
            cantidad: number | null;
        };
    })[]>;
    ventasPorEmpresa(): Promise<(import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.VentaGroupByOutputType, "id_empresa"[]> & {
        _count: {
            _all: number;
        };
        _sum: {
            total: number | null;
        };
    })[]>;
    ingresosPorFecha(inicio: string, fin: string): Promise<{
        fecha: Date;
        total: number;
    }[]>;
}
