// Lógica de negocio de usuario
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}
  getUsuarios() { return this.prisma.usuario.findMany(); }
  createUsuario(data:any) { return this.prisma.usuario.create({ data }); }
}
