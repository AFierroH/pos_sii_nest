import { EmpresaService } from './empresa.service';
export declare class EmpresaController {
    private readonly empresaService;
    constructor(empresaService: EmpresaService);
    getAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id_empresa: number;
        nombre: string;
        rut: string;
        direccion: string | null;
        telefono: string | null;
        email: string | null;
        codigo_sii: string;
        clave_sii: string;
    }[]>;
    create(data: any): import("@prisma/client").Prisma.Prisma__empresaClient<{
        id_empresa: number;
        nombre: string;
        rut: string;
        direccion: string | null;
        telefono: string | null;
        email: string | null;
        codigo_sii: string;
        clave_sii: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
