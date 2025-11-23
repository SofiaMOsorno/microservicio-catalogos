import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbService } from '../services/db.service';
import { Producto } from '../models';

export class ProductosController {
    async crear(req: Request, res: Response) {
        try {
            const { nombre, unidadMedida, precioBase } = req.body;

            if (!nombre || !unidadMedida || precioBase === undefined) {
                return res.status(400).json({ 
                    error: 'Faltan campos obligatorios',
                    campos_requeridos: ['nombre', 'unidadMedida', 'precioBase']
                });
            }

            if (typeof precioBase !== 'number' || precioBase < 0) {
                return res.status(400).json({ 
                    error: 'Precio base inválido',
                    detalle: 'El precio base debe ser un número positivo'
                });
            }

            const producto: Producto = {
                productoId: uuidv4(),
                nombre,
                unidadMedida,
                precioBase
            };

            await dbService.crearProducto(producto);
            res.status(201).json({
                message: 'Producto creado exitosamente',
                producto
            });
        } catch (error) {
            console.error('Error al crear producto:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al crear producto',
                detalle: 'Por favor intente nuevamente más tarde'
            });
        }
    }

    async obtenerTodos(req: Request, res: Response) {
        try {
            const productos = await dbService.obtenerTodosProductos();
            
            res.json({
                message: 'Productos obtenidos exitosamente',
                total: productos.length,
                productos
            });
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al obtener productos',
                detalle: 'Por favor intente nuevamente más tarde'
            });
        }
    }

    async obtenerPorId(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            const producto = await dbService.obtenerProducto(id);

            if (!producto) {
                return res.status(404).json({ 
                    error: 'Producto no encontrado',
                    detalle: `No existe un producto con ID ${id}`
                });
            }

            res.json({
                message: 'Producto obtenido exitosamente',
                producto
            });
        } catch (error) {
            console.error('Error al obtener producto:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al obtener producto',
                detalle: 'Por favor intente nuevamente más tarde'
            });
        }
    }

    async actualizar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const datos = req.body;

            if (Object.keys(datos).length === 0) {
                return res.status(400).json({ 
                    error: 'No se proporcionaron datos para actualizar'
                });
            }

            const productoExistente = await dbService.obtenerProducto(id);
            if (!productoExistente) {
                return res.status(404).json({ 
                    error: 'Producto no encontrado',
                    detalle: `No existe un producto con ID ${id}`
                });
            }

            if (datos.precioBase !== undefined) {
                if (typeof datos.precioBase !== 'number' || datos.precioBase < 0) {
                    return res.status(400).json({ 
                        error: 'Precio base inválido',
                        detalle: 'El precio base debe ser un número positivo'
                    });
                }
            }

            await dbService.actualizarProducto(id, datos);
            res.json({ 
                message: 'Producto actualizado correctamente',
                productoId: id
            });
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al actualizar producto',
                detalle: 'Por favor intente nuevamente más tarde'
            });
        }
    }

    async eliminar(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const productoExistente = await dbService.obtenerProducto(id);
            if (!productoExistente) {
                return res.status(404).json({ 
                    error: 'Producto no encontrado',
                    detalle: `No existe un producto con ID ${id}`
                });
            }

            await dbService.eliminarProducto(id);
            res.json({ 
                message: 'Producto eliminado correctamente',
                productoId: id
            });
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al eliminar producto',
                detalle: 'Por favor intente nuevamente más tarde'
            });
        }
    }
}

export const productosController = new ProductosController();