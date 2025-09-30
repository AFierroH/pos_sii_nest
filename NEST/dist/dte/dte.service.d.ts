import { PrismaService } from '../prisma.service';
export declare function getFormattedDate(): string;
export declare class DteService {
    private prisma;
    constructor(prisma: PrismaService);
    emitirDte(data: any): Promise<{
        printer: string;
        data: string[];
    }>;
    productosMasVendidos(): Promise<(import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.Detalle_ventaGroupByOutputType, "id_producto"[]> & {
        _sum: {
            cantidad: number | null;
        };
    })[]>;
    ventasPorEmpresa(): Promise<(import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.VentaGroupByOutputType, "id_empresa"[]> & {
        _sum: {
            total: number | null;
        };
        _count: {
            _all: number;
        };
    })[]>;
    ingresosPorFecha(inicio: string, fin: string): Promise<{
        fecha: Date;
        total: number;
    }[]>;
}
