// Lógica de negocio para emisión de DTE y estadísticas
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
export function getFormattedDate() {
  const now = new Date();
  return now.toLocaleString('en-US', {
    month: 'short',   
    day: 'numeric',   
    year: 'numeric',  
    hour: 'numeric',  
    minute: '2-digit',
    hour12: true      
  });
}
@Injectable()
export class DteService {
  constructor(private prisma: PrismaService) {}

  // Emite un DTE (crea venta + detalles y devuelve datos + comandos ESC/POS)
  // dte.service.ts
async emitirDte(data: any) {
  const fecha = new Date().toLocaleString();

  var escpos = [
  '\x1B' + '\x40',          // init printer
  '\x1B' + '\x52' + '\x03', // ESC R 3 → Spain
  '\x1B' + '\x74' + '\x13', // ESC t 19 → Western Europe (CP1252)
  '\x1B' + '\x61' + '\x31', // center align
  'Av. Alemania 671, 4800971 Temuco, Araucanía' + '\x0A',
  'Cerveza Cristal (Qty 4)       $2.000' + '\x0A',
  'Ñandú, café, azúcar, acción, útil' + '\x0A',
  '------------------------------------------' + '\x0A',
  'Texto normal con acentos OK áéíóú Ñ' + '\x0A',
  '\x1D' + '\x56' + '\x30'  // cortar papel
];
  return {
    printer: "XP-80C2", // nombre exacto en Windows
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
