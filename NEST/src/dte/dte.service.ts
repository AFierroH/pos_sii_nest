// Lógica de negocio para emisión de DTE y estadísticas
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { createCanvas } from 'canvas'; // sólo para PNG preview

export function getFormattedDate() {
  const now = new Date();
  return now.toLocaleString('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

@Injectable()
export class DteService {
  constructor(private prisma: PrismaService) {}

  // Emite un DTE (crea venta + detalles y devuelve ticket ESC/POS o PNG preview)
  async emitirDte(payload: any) {
    const { id_usuario, id_empresa, total, detalles = [], usarImpresora = true } = payload;
    if (!detalles || detalles.length === 0) {
      throw new InternalServerErrorException('No hay items en la venta');
    }

    const fecha = getFormattedDate();

    // Simular venta guardada (ejemplo, tú ya tienes transacciones reales con prisma)
    const venta = {
      id_venta: Math.floor(Math.random() * 9999),
      fecha,
      total,
      id_usuario,
      id_empresa,
      detalles,
    };

    if (usarImpresora) {
      // --- Construir ESC/POS ticket ---
      const escpos: any[] = [];

      escpos.push('\x1B\x40');          // init printer
      escpos.push('\x1B\x52\x03');      // ESC R 3 → Spain
      escpos.push('\x1B\x74\x13');      // ESC t 19 → Western Europe (CP1252)
      escpos.push('\x1B\x61\x31');      // center align
      escpos.push('Av. Alemania 671, 4800971 Temuco, Araucanía\n');
      escpos.push(`Venta #: ${venta.id_venta}\n`);
      escpos.push(`Fecha: ${venta.fecha}\n`);
      escpos.push('------------------------------------------\n');

      for (const d of detalles) {
        escpos.push(`${d.cantidad} x Prod#${d.id_producto}  $${d.precio_unitario}\n`);
      }

      escpos.push('------------------------------------------\n');
      escpos.push(`TOTAL: $${venta.total}\n`);
      escpos.push('Gracias por su compra\n\n');
      escpos.push('\x1D\x56\x30'); // cortar

      return {
        usarImpresora: true,
        printer: 'XP-80C2',
        data: escpos,
        venta,
      };
    } else {
      // --- Generar PNG preview con node-canvas ---
      const width = 570;
      const lineHeight = 20;
      const height = 200 + detalles.length * lineHeight;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // fondo blanco
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // header
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Av. Alemania 671, Temuco', width / 2, 30);

      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      let y = 60;
      ctx.fillText(`Venta #: ${venta.id_venta}`, 10, y);
      ctx.fillText(`Fecha: ${venta.fecha}`, 10, y + 18);
      y += 40;

      ctx.fillText('------------------------------------------', 10, y);
      y += 20;

      for (const d of detalles) {
        ctx.fillText(`${d.cantidad} x Prod#${d.id_producto}`, 10, y);
        ctx.textAlign = 'right';
        ctx.fillText(`$${d.precio_unitario}`, width - 10, y);
        ctx.textAlign = 'left';
        y += lineHeight;
      }

      ctx.fillText('------------------------------------------', 10, y);
      y += 20;
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`TOTAL: $${venta.total}`, width - 10, y);

      const buffer = canvas.toBuffer('image/png');
      const base64 = buffer.toString('base64');

      return {
        usarImpresora: false,
        venta,
        boletaBase64: base64,
      };
    }
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
