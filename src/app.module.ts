// Módulo raíz donde se importan todos los demás módulos
import { Module } from '@nestjs/common';
import { EmpresaModule } from './empresa/empresa.module';
import { UsuarioModule } from './usuario/usuario.module';
import { VentaModule } from './venta/venta.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [EmpresaModule, UsuarioModule, VentaModule],
  providers: [PrismaService],
})
export class AppModule {}