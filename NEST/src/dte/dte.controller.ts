/* import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { DteService } from './dte.service';

@Controller('dte')
export class DteController {
  constructor(private readonly dteService: DteService) {}

  @Post('emitir')
  emitir(@Body() data: any) {
    console.log('POST /dte/emitir llamado con data:', data);
    return this.dteService.emitirDte(data);
  }

  @Get('productos-mas-vendidos')
  topProductos() {
    console.log('GET /productos-mas-vendidos llamado');
    return this.dteService.productosMasVendidos();
  }

  @Get('ventas-por-empresa')
  ventasEmpresa() {
    console.log('GET /ventas-por-empresa llamado');
    return this.dteService.ventasPorEmpresa();
  }

  @Get('ingresos-por-fecha')
  ingresosFecha(@Query('inicio') inicio: string, @Query('fin') fin: string) {
    console.log('GET /ingresos-por-fecha llamado con:', { inicio, fin });
    return this.dteService.ingresosPorFecha(inicio, fin);
  }
}
 */

// src/dte/dte.controller.ts
// src/dte/dte.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { DteService } from './dte.service';

@Controller('dte')
export class DteController {
  constructor(private dte: DteService) {}

  @Post('emitir')
  async emitir(@Body() payload: any) {
    // payload incluye usarImpresora boolean
    return this.dte.emitirDte(payload);
  }
}
