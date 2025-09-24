// Lógica de negocio para emisión de DTE y estadísticas
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DteService {
  constructor(private prisma: PrismaService) {}

  // Emite un DTE (crea venta + detalles y devuelve datos + comandos ESC/POS)
  // dte.service.ts
async emitirDte(data: any) {
  const fecha = new Date().toLocaleString();

  const escpos = [
    { type: 'raw', format: 'plain', data: '\x1B\x40' }, // init
    { type: 'raw', format: 'plain', data: '=== PRUEBA DE IMPRESORA ===\n' },
    { type: 'raw', format: 'plain', data: `Fecha: ${fecha}\n` },
    { type: 'raw', format: 'plain', data: 'Linea 1: Texto normal\n' },
    { type: 'raw', format: 'plain', data: '\x1B\x45\x01Texto en negrita\x1B\x45\x00\n' },
    { type: 'raw', format: 'plain', data: '\n\n\n' }
  ];

  return {
    printer: "XP-80C", // nombre exacto en Windows
    data: escpos
  };
}


  // Estadística: productos más vendidos
  async productosMasVendidos() {
    return this.prisma.detalle_venta.groupBy({
      by: ['id_producto'],
      _sum: { cantidad: true },
      orderBy: { _sum: { cantidad: 'desc' } },
      take: 5,
    });
  }

  // Estadística: ventas agrupadas por empresa
  async ventasPorEmpresa() {
    return this.prisma.venta.groupBy({
      by: ['id_empresa'],
      _sum: { total: true },
      _count: { _all: true },
    });
  }

  // Estadística: ingresos en un rango de fechas
  async ingresosPorFecha(inicio: string, fin: string) {
    return this.prisma.venta.findMany({
      where: { fecha: { gte: new Date(inicio), lte: new Date(fin) } },
      select: { fecha: true, total: true },
    });
  }
}
