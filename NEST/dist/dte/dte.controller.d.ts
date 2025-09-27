import { DteService } from './dte.service';
export declare class DteController {
    private readonly dteService;
    constructor(dteService: DteService);
    emitir(data: any): Promise<{
        printer: string;
        data: {
            type: string;
            format: string;
            data: string;
        }[];
    }>;
    topProductos(): Promise<(import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.Detalle_ventaGroupByOutputType, "id_producto"[]> & {
        _sum: {
            cantidad: number | null;
        };
    })[]>;
    ventasEmpresa(): Promise<(import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.VentaGroupByOutputType, "id_empresa"[]> & {
        _count: {
            _all: number;
        };
        _sum: {
            total: number | null;
        };
    })[]>;
    ingresosFecha(inicio: string, fin: string): Promise<{
        fecha: Date;
        total: number;
    }[]>;
}
