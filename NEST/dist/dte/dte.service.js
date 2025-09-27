"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DteService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let DteService = class DteService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async emitirDte(data) {
        const fecha = new Date().toLocaleString();
        const escpos = [
            { type: 'raw', format: 'plain', data: '\x1B\x40' },
            { type: 'raw', format: 'plain', data: '=== PRUEBA DE IMPRESORA ===\n' },
            { type: 'raw', format: 'plain', data: `Fecha: ${fecha}\n` },
            { type: 'raw', format: 'plain', data: 'Linea 1: Texto normal\n' },
            { type: 'raw', format: 'plain', data: '\x1B\x45\x01Texto en negrita\x1B\x45\x00\n' },
            { type: 'raw', format: 'plain', data: '\n\n\n' }
        ];
        return {
            printer: "XP-80C",
            data: escpos
        };
    }
    async productosMasVendidos() {
        return this.prisma.detalle_venta.groupBy({
            by: ['id_producto'],
            _sum: { cantidad: true },
            orderBy: { _sum: { cantidad: 'desc' } },
            take: 5,
        });
    }
    async ventasPorEmpresa() {
        return this.prisma.venta.groupBy({
            by: ['id_empresa'],
            _sum: { total: true },
            _count: { _all: true },
        });
    }
    async ingresosPorFecha(inicio, fin) {
        return this.prisma.venta.findMany({
            where: { fecha: { gte: new Date(inicio), lte: new Date(fin) } },
            select: { fecha: true, total: true },
        });
    }
};
exports.DteService = DteService;
exports.DteService = DteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DteService);
//# sourceMappingURL=dte.service.js.map