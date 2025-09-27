import { PrismaService } from '../prisma.service';
export declare class UsuarioService {
    private prisma;
    constructor(prisma: PrismaService);
    getUsuarios(): import("@prisma/client").Prisma.PrismaPromise<{
        id_empresa: number;
        nombre: string;
        email: string;
        id_usuario: number;
        clave: string;
        rol: string;
    }[]>;
    createUsuario(data: any): import("@prisma/client").Prisma.Prisma__usuarioClient<{
        id_empresa: number;
        nombre: string;
        email: string;
        id_usuario: number;
        clave: string;
        rol: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
