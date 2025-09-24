// Lógica de negocio de venta
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class VentaService {
  constructor(private prisma: PrismaService) {}
  getVentas() { return this.prisma.venta.findMany({ include:{detalles:true} }); }
  createVenta(data:any) { return this.prisma.venta.create({ data }); }
}
