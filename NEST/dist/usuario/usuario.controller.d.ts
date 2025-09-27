import { UsuarioService } from './usuario.service';
export declare class UsuarioController {
    private readonly usuarioService;
    constructor(usuarioService: UsuarioService);
    getAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id_empresa: number;
        nombre: string;
        email: string;
        id_usuario: number;
        clave: string;
        rol: string;
    }[]>;
    create(data: any): import("@prisma/client").Prisma.Prisma__usuarioClient<{
        id_empresa: number;
        nombre: string;
        email: string;
        id_usuario: number;
        clave: string;
        rol: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
