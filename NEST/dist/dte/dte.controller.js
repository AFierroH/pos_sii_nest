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
exports.DteController = void 0;
const common_1 = require("@nestjs/common");
const dte_service_1 = require("./dte.service");
let DteController = class DteController {
    dteService;
    constructor(dteService) {
        this.dteService = dteService;
    }
    emitir(data) {
        console.log('POST /dte/emitir llamado con data:', data);
        return this.dteService.emitirDte(data);
    }
    topProductos() {
        console.log('GET /productos-mas-vendidos llamado');
        return this.dteService.productosMasVendidos();
    }
    ventasEmpresa() {
        console.log('GET /ventas-por-empresa llamado');
        return this.dteService.ventasPorEmpresa();
    }
    ingresosFecha(inicio, fin) {
        console.log('GET /ingresos-por-fecha llamado con:', { inicio, fin });
        return this.dteService.ingresosPorFecha(inicio, fin);
    }
};
exports.DteController = DteController;
__decorate([
    (0, common_1.Post)('emitir'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DteController.prototype, "emitir", null);
__decorate([
    (0, common_1.Get)('productos-mas-vendidos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DteController.prototype, "topProductos", null);
__decorate([
    (0, common_1.Get)('ventas-por-empresa'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DteController.prototype, "ventasEmpresa", null);
__decorate([
    (0, common_1.Get)('ingresos-por-fecha'),
    __param(0, (0, common_1.Query)('inicio')),
    __param(1, (0, common_1.Query)('fin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DteController.prototype, "ingresosFecha", null);
exports.DteController = DteController = __decorate([
    (0, common_1.Controller)('dte'),
    __metadata("design:paramtypes", [dte_service_1.DteService])
], DteController);
//# sourceMappingURL=dte.controller.js.map