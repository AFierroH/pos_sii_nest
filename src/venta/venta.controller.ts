// Endpoints HTTP de venta
import { Controller, Get, Post, Body } from '@nestjs/common';
import { VentaService } from './venta.service';

@Controller('ventas')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}
  @Get() getAll() { return this.ventaService.getVentas(); }
  @Post() create(@Body() data:any) { return this.ventaService.createVenta(data); }
}
