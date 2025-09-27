"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentaModule = void 0;
const common_1 = require("@nestjs/common");
const venta_service_1 = require("./venta.service");
const venta_controller_1 = require("./venta.controller");
const prisma_service_1 = require("../prisma.service");
let VentaModule = class VentaModule {
};
exports.VentaModule = VentaModule;
exports.VentaModule = VentaModule = __decorate([
    (0, common_1.Module)({
        controllers: [venta_controller_1.VentaController],
        providers: [venta_service_1.VentaService, prisma_service_1.PrismaService],
    })
], VentaModule);
//# sourceMappingURL=venta.module.js.map