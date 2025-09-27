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
   '\x1B' + '\x40',          // init
   { type: 'raw', format: 'plain', data: '\x1B\x74\x35' },
   '\x1B' + '\x61' + '\x31', // center align
   'Av. Alemania 671, 4800971 Temuco, Araucania' + '\x0A',
   '\x0A',                   // line break
   'https://cencomalls.cl/temuco' + '\x0A',     // text and line break
   '\x0A',                   // line break
   '\x0A',                   // line break
   getFormattedDate() + '\x0A',
   '\x0A',                   // line break
   '\x0A',                   // line break    
   '\x0A',
   'Transaccion # 123456 Caja: 3' + '\x0A',
   '\x0A',
   '\x0A',
   '\x0A',
   '\x1B' + '\x61' + '\x30', // left align
   'Cerveza Cristal (Qty 4)       $2.000' + '\x1B' + '\x74' + '\x13' + '\xAA', //print special char symbol after numeric
   '\x0A',
   'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' + '\x0A',       
   '\x1B' + '\x45' + '\x0D', // bold on
   'Texto en negrita prueba',
   '\x1B' + '\x45' + '\x0A', // bold off
   '\x0A' + '\x0A',
   '\x1B' + '\x61' + '\x32', // right align
   '\x1B' + '\x21' + '\x30', // em mode on
   'DERECHA',
   '\x1B' + '\x21' + '\x0A' + '\x1B' + '\x45' + '\x0A', // em mode off
   '\x0A' + '\x0A',
   '\x1B' + '\x61' + '\x30', // left align
   '------------------------------------------' + '\x0A',
   '\x1B' + '\x4D' + '\x31', // small text
   'TEXTO PEQUEÑO PRUEBA' + '\x0A',
   '\x1B' + '\x4D' + '\x30', // normal text
   '------------------------------------------' + '\x0A',
   'Texto normal prueba' + '\x0A',
   '\x1B' + '\x61' + '\x30', // left align
   '\x0A' + '\x0A' + '\x0A' + '\x0A' + '\x0A' + '\x0A' + '\x0A',
   '\x1D' + '\x56' + '\x30',
   //   '\x1B' + '\x69',          // cut paper (old syntax)
// '\x1D' + '\x56'  + '\x00' // full cut (new syntax)
// '\x1D' + '\x56'  + '\x30' // full cut (new syntax)
// '\x1D' + '\x56'  + '\x01' // partial cut (new syntax)
// '\x1D' + '\x56'  + '\x31' // partial cut (new syntax)
//  '\x10' + '\x14' + '\x01' + '\x00' + '\x05',  // Generate Pulse to kick-out cash drawer**
                                                // **for legacy drawer cable CD-005A.  Research before using.
// Star TSP100-series kick-out ONLY
// '\x1B' + '\x70' + '\x00' /* drawer 1 */ + '\xC8' + '\xC8' + '\x1B' + '\x1F' + '\x70' + '\x03' + '\x00',
// '\x1B' + '\x70' + '\x01' /* drawer 2 */ + '\xC8' + '\xC8' + '\x1B' + '\x1F' + '\x70' + '\x03' + '\x00',
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
