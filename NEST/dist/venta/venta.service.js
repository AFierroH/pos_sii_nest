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
exports.VentaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let VentaService = class VentaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getVentas() {
        return this.prisma.venta.findMany({ include: { detalles: true } });
    }
    async createVenta(data) {
        return this.prisma.venta.create({ data });
    }
    async ventasPorFecha(inicio, fin) {
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
};
exports.VentaService = VentaService;
exports.VentaService = VentaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VentaService);
//# sourceMappingURL=venta.service.js.map