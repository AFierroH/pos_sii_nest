// Endpoints HTTP de usuario
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsuarioService } from './usuario.service';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}
  @Get() getAll() { return this.usuarioService.getUsuarios(); }
  @Post() create(@Body() data:any) { return this.usuarioService.createUsuario(data); }
}
