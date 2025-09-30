import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ProductoService } from './producto.service';

@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Get()
  async getProductos(@Query('search') search?: string) {
    return this.productoService.getProductos(search);
  }

  @Post()
  async createProducto(@Body() data: any) {
    return this.productoService.createProducto(data);
  }
}
