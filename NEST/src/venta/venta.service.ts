import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DteService } from '../dte/dte.service';
import { PrismaService } from '../prisma.service';
import * as iconv from 'iconv-lite';
@Injectable()
export class VentaService {
  constructor(
    private dteService: DteService,
    private prisma: PrismaService 
  ) {}

async crearVenta(payload: any) {
  const { id_usuario, id_empresa, total, detalles, pagos } = payload;
  const venta = await this.prisma.venta.create({
    data: {
      fecha: new Date(),
      total,
      id_usuario,
      id_empresa,
      detalle_venta: {
        create: detalles.map(d => ({
          id_producto: d.id_producto,
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario,
          subtotal: d.cantidad * d.precio_unitario,
        })),
      },
      pagos: {
        create: pagos?.map(p => ({
          id_pago: p.id_pago,
          monto: p.monto,
        })) || [],
      },
    },
    include: { detalle_venta: true, pagos: true },
  });
  return venta;
}

async emitirDte(payload: any) {
    const { id_usuario, id_empresa, total, detalles = [], usarImpresora = true } = payload;
    if (!detalles || detalles.length === 0) {
      throw new InternalServerErrorException('No hay items en la venta');
    }

    const empresaDemo = {rut: "76.543.210-K",
      razonSocial: "Comercial Temuco SpA",
      giro: "Venta de artículos electrónicos",
      direccion: "Av. Alemania 671",
      comuna: "Temuco",
      ciudad: "Araucanía",
      telefono: "+56 45 2123456",
      correo: "contacto@temuco-demo.cl",
      logo: ""};
    const fecha = new Date().toLocaleString('es-CL', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' });
    const venta = { id_venta: Math.floor(Math.random()*99999), fecha, total, id_usuario, id_empresa, detalles };
    const neto = Math.round(total / 1.19);
    const iva = total - neto;

    // Helpers
    const esc = (hexes: number[]) => Buffer.from(hexes);
    const textBuf = (s: string) => iconv.encode(s, 'cp858');
    const buffers: Buffer[] = [];
    function encodedWithRaw(parts:any[]) {
      const result = parts.map(p => typeof p === 'string' ? textBuf(p) : p);
      return Buffer.concat(result);
    }
    function pushCorreoSeguro(buffersArr: Buffer[], correo: string) {
      const [before, after] = correo.split('@');
      if (!after) { buffersArr.push(textBuf(correo + '\n')); return; }
      buffersArr.push(Buffer.concat([ textBuf(before), Buffer.from('@'), textBuf(after + '\n') ]));
    }

    // bytes escpos
    buffers.push(esc([0x1B,0x40]));
    buffers.push(esc([0x1C,0x2E]));
    buffers.push(esc([0x1B,0x74,0x12]));
    buffers.push(esc([0x1B,0x61,0x01]));
    buffers.push(textBuf(`${empresaDemo.razonSocial}\n`));
    buffers.push(textBuf(`RUT: ${empresaDemo.rut}\n`));
    pushCorreoSeguro(buffers, empresaDemo.correo);
    buffers.push(textBuf('------------------------------------------\n'));
    buffers.push(esc([0x1B,0x61,0x00]));
    buffers.push(encodedWithRaw(['Venta ', Buffer.from('#'), `${venta.id_venta}\n`]));
    buffers.push(textBuf(`Fecha: ${venta.fecha}\n`));
    buffers.push(textBuf('------------------------------------------\n'));

    for (const d of detalles) {
      const line = `${d.cantidad} x ${d.nombre}`;
      const precio = `$${d.precio_unitario}`;
      const formatted = line.padEnd(30).slice(0,30) + precio.padStart(10).slice(-10) + '\n';
      buffers.push(textBuf(formatted));
    }

    buffers.push(textBuf('------------------------------------------\n'));
    buffers.push(textBuf(`Neto: $${neto}\n`));
    buffers.push(textBuf(`IVA (19%): $${iva}\n`));
    buffers.push(textBuf(`TOTAL: $${venta.total}\n`));
    buffers.push(esc([0x1B,0x61,0x01]));
    buffers.push(textBuf('Gracias por su compra\n\n'));
    buffers.push(esc([0x1B,0x64,0x03]));
    buffers.push(esc([0x1D,0x56,0x42,0x00]));

    const payloadBuffer = Buffer.concat(buffers);

/*     // Generar preview PNG (igual que tenías)
    const width = 570;
    const lineHeight = 20;
    const height = 300 + detalles.length * lineHeight;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFF'; ctx.fillRect(0,0,width,height);
    try { const logo = await loadImage(empresaDemo.logo); ctx.drawImage(logo, width-80, 10, 80, 80); } catch {}
    ctx.fillStyle = '#000'; ctx.font='bold 16px Arial'; ctx.textAlign='center';
    ctx.fillText(`${empresaDemo.razonSocial}`, width/2, 40);
    ctx.font='12px Arial';
    ctx.fillText(`RUT: ${empresaDemo.rut}`, width/2, 60);
    // ... resto del texto similar ...
    let y = 120;
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
    ctx.fillText(`Neto: $${neto}`, 10, y);
    y += 18;
    ctx.fillText(`IVA (19%): $${iva}`, 10, y);
    y += 18;
    ctx.font='bold 14px Arial';
    ctx.fillText(`TOTAL: $${venta.total}`, 10, y);

    const pngBuffer = canvas.toBuffer('image/png'); */

    // Retornamos los bytes del ticket en base64 (para que el cliente/Electron los imprima)
    return {
      usarImpresora: true, // backend ya no intenta imprimir
      venta,
      boletaBase64: payloadBuffer.toString('base64'),
      ticketBase64: payloadBuffer.toString('base64') // ESC/POS raw en base64
    };
  }
async emitirVentaCompleta(payload: any) {
  const ventaDb = await this.crearVenta(payload);

  const dtePayload = {
    ...payload,
    detalles: ventaDb.detalle_venta.map(d => ({
      id_producto: d.id_producto,
      cantidad: d.cantidad,
      precio_unitario: d.precio_unitario,
      nombre: payload.detalles.find(x => x.id_producto === d.id_producto)?.nombre || '',
    })),
    total: ventaDb.total,
    id_usuario: ventaDb.id_usuario,
    id_empresa: ventaDb.id_empresa,
  };
  const ticket = await this.emitirDte(dtePayload);

  return {
    venta: ventaDb,
    ticket,
  };
}
}
