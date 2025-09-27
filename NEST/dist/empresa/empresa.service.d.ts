import { PrismaService } from '../prisma.service';
export declare class EmpresaService {
    private prisma;
    constructor(prisma: PrismaService);
    getEmpresas(): import("@prisma/client").Prisma.PrismaPromise<{
        id_empresa: number;
        nombre: string;
        rut: string;
        direccion: string | null;
        telefono: string | null;
        email: string | null;
        codigo_sii: string;
        clave_sii: string;
    }[]>;
    createEmpresa(data: any): import("@prisma/client").Prisma.Prisma__empresaClient<{
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
