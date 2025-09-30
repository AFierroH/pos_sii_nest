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
exports.getFormattedDate = getFormattedDate;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
function getFormattedDate() {
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
let DteService = class DteService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async emitirDte(data) {
        const fecha = new Date().toLocaleString();
        var escpos = [
            '\x1B' + '\x40',
            '\x1B' + '\x52' + '\x03',
            '\x1B' + '\x74' + '\x13',
            '\x1B' + '\x61' + '\x31',
            'Av. Alemania 671, 4800971 Temuco, Araucanía' + '\x0A',
            'Cerveza Cristal (Qty 4)       $2.000' + '\x0A',
            'Ñandú, café, azúcar, acción, útil' + '\x0A',
            '------------------------------------------' + '\x0A',
            'Texto normal con acentos OK áéíóú Ñ' + '\x0A',
            '\x1D' + '\x56' + '\x30'
        ];
        return {
            printer: "XP-80C2",
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