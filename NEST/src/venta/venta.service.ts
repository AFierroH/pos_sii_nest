import { Injectable } from '@nestjs/common';
import { DteService } from '../dte/dte.service';

@Injectable()
export class VentaService {
  constructor(private dteService: DteService) {}

  async crearVentaSimulada(payload: any) {
    // Aquí pasamos el flag usarImpresora según queramos
    return this.dteService.emitirDte(payload);
  }
}
