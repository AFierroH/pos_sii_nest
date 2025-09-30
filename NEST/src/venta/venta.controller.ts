import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { VentaService } from './venta.service';
import { DteService } from '../dte/dte.service';

@Controller('ventas')
export class VentaController {
  constructor(private ventaService: VentaService, private dteService: DteService) {}

  @Get()
  getVentas() {
    return this.ventaService.getVentas();
  }

  @Post()
  async crearVenta(@Body() payload) {
    return this.ventaService.createVenta(payload);
  }

  @Post('emitir')
  async emitirDte(@Body() payload) {
    return this.dteService.emitirDte(payload);
  }

  @Get('por-fecha')
  async ventasPorFecha(@Query('inicio') inicio: string, @Query('fin') fin: string) {
    return this.ventaService.ventasPorFecha(inicio, fin);
  }

  @Get('ticket-promedio')
  async ticketPromedio() {
    return this.ventaService.ticketPromedio();
  }
}
