import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class VentaService {
  constructor(private prisma: PrismaService) {}

  async getVentas() {
    return this.prisma.venta.findMany({ include: { detalles: true } });
  }

  async createVenta(data: any) {
    return this.prisma.venta.create({ data });
  }

  async ventasPorFecha(inicio: string, fin: string) {
    return this.prisma.venta.findMany({
      where: { fecha: { gte: new Date(inicio), lte: new Date(fin) } },
      select: { fecha: true, total: true }
    });
  }

  async ticketPromedio() {
    const ventas = await this.prisma.venta.findMany({ select: { total: true } });
    const total = ventas.reduce((a, b) => a + b.total, 0);
    return ventas.length ? total / ventas.length : 0;
  }
}
