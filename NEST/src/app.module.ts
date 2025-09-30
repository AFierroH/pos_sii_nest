// Módulo raíz donde se importan todos los demás módulos
import { AppController } from './app.controller';
import { DteModule } from './dte/dte.module';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { EmpresaModule } from './empresa/empresa.module';
import { UsuarioModule } from './usuario/usuario.module';
import { VentaModule } from './venta/venta.module';
import { ProductoModule } from './producto/producto.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [EmpresaModule, UsuarioModule, VentaModule, DteModule, ProductoModule],
  controllers: [AppController],
  providers: [PrismaService, AppService], 
})
export class AppModule {}