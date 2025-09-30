import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, producto } from '@prisma/client';

@Injectable()
export class ProductoService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtener productos con búsqueda opcional por nombre (insensible a mayúsculas)
   * @param search texto a buscar en el nombre
   * @returns lista de productos
   */
  async getProductos(search?: string): Promise<producto[]> {
    return this.prisma.producto.findMany({
      where: search
        ? {
            nombre: {
              contains: search,
              // mode: 'insensitive', // Prisma 5 soporta esto directamente
            },
          }
        : undefined,
      orderBy: { id_producto: 'asc' }, // opcional, orden por ID
    });
  }

  /**
   * Crear un nuevo producto
   * @param data objeto con los campos del producto
   * @returns producto creado
   */
  async createProducto(data: Prisma.productoCreateInput): Promise<producto> {
    return this.prisma.producto.create({ data });
  }

  /**
   * Obtener un producto por ID
   * @param id ID del producto
   * @returns producto o null si no existe
   */
  async getProductoById(id: number): Promise<producto | null> {
    return this.prisma.producto.findUnique({
      where: { id_producto: id },
    });
  }

  /**
   * Actualizar un producto existente
   * @param id ID del producto
   * @param data campos a actualizar
   * @returns producto actualizado
   */
  async updateProducto(
    id: number,
    data: Prisma.productoUpdateInput,
  ): Promise<producto> {
    return this.prisma.producto.update({
      where: { id_producto: id },
      data,
    });
  }

  /**
   * Eliminar un producto
   * @param id ID del producto
   * @returns producto eliminado
   */
  async deleteProducto(id: number): Promise<producto> {
    return this.prisma.producto.delete({
      where: { id_producto: id },
    });
  }
}
