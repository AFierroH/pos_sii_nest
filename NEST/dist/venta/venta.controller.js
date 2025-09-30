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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentaController = void 0;
const common_1 = require("@nestjs/common");
const venta_service_1 = require("./venta.service");
const dte_service_1 = require("../dte/dte.service");
let VentaController = class VentaController {
    ventaService;
    dteService;
    constructor(ventaService, dteService) {
        this.ventaService = ventaService;
        this.dteService = dteService;
    }
    getVentas() {
        return this.ventaService.getVentas();
    }
    async crearVenta(payload) {
        return this.ventaService.createVenta(payload);
    }
    async emitirDte(payload) {
        return this.dteService.emitirDte(payload);
    }
    async ventasPorFecha(inicio, fin) {
        return this.ventaService.ventasPorFecha(inicio, fin);
    }
    async ticketPromedio() {
        return this.ventaService.ticketPromedio();
    }
};
exports.VentaController = VentaController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VentaController.prototype, "getVentas", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VentaController.prototype, "crearVenta", null);
__decorate([
    (0, common_1.Post)('emitir'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VentaController.prototype, "emitirDte", null);
__decorate([
    (0, common_1.Get)('por-fecha'),
    __param(0, (0, common_1.Query)('inicio')),
    __param(1, (0, common_1.Query)('fin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VentaController.prototype, "ventasPorFecha", null);
__decorate([
    (0, common_1.Get)('ticket-promedio'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VentaController.prototype, "ticketPromedio", null);
exports.VentaController = VentaController = __decorate([
    (0, common_1.Controller)('ventas'),
    __metadata("design:paramtypes", [venta_service_1.VentaService, dte_service_1.DteService])
], VentaController);
//# sourceMappingURL=venta.controller.js.map