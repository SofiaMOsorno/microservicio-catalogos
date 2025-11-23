import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbService } from '../services/db.service';
import { Domicilio } from '../models';

export class DomiciliosController {
    async crear(req: Request, res: Response) {
        try {
            const { clienteId } = req.params;
            const { domicilio, colonia, municipio, estado, tipoDireccion } = req.body;

            const cliente = await dbService.obtenerCliente(clienteId);
            if (!cliente) {
                return res.status(404).json({ 
                    error: 'Cliente no encontrado',
                    detalle: `No existe un cliente con ID ${clienteId}`
                });
            }

            if (!domicilio || !colonia || !municipio || !estado || !tipoDireccion) {
                return res.status(400).json({ 
                    error: 'Faltan campos obligatorios',
                    campos_requeridos: ['domicilio', 'colonia', 'municipio', 'estado', 'tipoDireccion']
                });
            }

            if (tipoDireccion !== 'FACTURACION' && tipoDireccion !== 'ENVIO') {
                return res.status(400).json({ 
                    error: 'Tipo de dirección inválido',
                    detalle: 'El tipo de dirección debe ser "FACTURACION" o "ENVIO"',
                    valores_permitidos: ['FACTURACION', 'ENVIO']
                });
            }

            const nuevoDomicilio: Domicilio = {
                domicilioId: uuidv4(),
                clienteId,
                domicilio,
                colonia,
                municipio,
                estado,
                tipoDireccion
            };

            await dbService.crearDomicilio(nuevoDomicilio);
            res.status(201).json({
                message: 'Domicilio creado exitosamente',
                domicilio: nuevoDomicilio
            });
        } catch (error) {
            console.error('Error al crear domicilio:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al crear domicilio',
                detalle: 'Por favor intente nuevamente más tarde'
            });
        }
    }

    async obtenerTodos(req: Request, res: Response) {
        try {
            const domicilios = await dbService.obtenerTodosDomicilios();
            
            res.json({
                message: 'Domicilios obtenidos exitosamente',
                total: domicilios.length,
                domicilios
            });
        } catch (error) {
            console.error('Error al obtener domicilios:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al obtener domicilios',
                detalle: 'Por favor intente nuevamente más tarde'
            });
        }
    }

    // ✅ CORREGIDO: Ahora se usa desde la ruta /clientes/:clienteId/domicilios
    async obtenerPorCliente(req: Request, res: Response) {
        try {
            const { clienteId } = req.params;
            
            const cliente = await dbService.obtenerCliente(clienteId);
            if (!cliente) {
                return res.status(404).json({ 
                    error: 'Cliente no encontrado',
                    detalle: `No existe un cliente con ID ${clienteId}`
                });
            }

            const domicilios = await dbService.obtenerDomiciliosPorCliente(clienteId);
            
            res.json({
                message: 'Domicilios obtenidos exitosamente',
                clienteId,
                total: domicilios.length,
                domicilios
            });
        } catch (error) {
            console.error('Error al obtener domicilios:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al obtener domicilios',
                detalle: 'Por favor intente nuevamente más tarde'
            });
        }
    }

    async obtenerPorId(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            const domicilio = await dbService.obtenerDomicilio(id);

            if (!domicilio) {
                return res.status(404).json({ 
                    error: 'Domicilio no encontrado',
                    detalle: `No existe un domicilio con ID ${id}`
                });
            }

            res.json({
                message: 'Domicilio obtenido exitosamente',
                domicilio
            });
        } catch (error) {
            console.error('Error al obtener domicilio:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al obtener domicilio',
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

            const domicilioExistente = await dbService.obtenerDomicilio(id);
            if (!domicilioExistente) {
                return res.status(404).json({ 
                    error: 'Domicilio no encontrado',
                    detalle: `No existe un domicilio con ID ${id}`
                });
            }

            if (datos.tipoDireccion && datos.tipoDireccion !== 'FACTURACION' && datos.tipoDireccion !== 'ENVIO') {
                return res.status(400).json({ 
                    error: 'Tipo de dirección inválido',
                    detalle: 'El tipo de dirección debe ser "FACTURACION" o "ENVIO"',
                    valores_permitidos: ['FACTURACION', 'ENVIO']
                });
            }

            if (datos.clienteId) {
                return res.status(400).json({ 
                    error: 'No se puede cambiar el cliente asociado al domicilio'
                });
            }

            await dbService.actualizarDomicilio(id, datos);
            res.json({ 
                message: 'Domicilio actualizado correctamente',
                domicilioId: id
            });
        } catch (error) {
            console.error('Error al actualizar domicilio:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al actualizar domicilio',
                detalle: 'Por favor intente nuevamente más tarde'
            });
        }
    }

    async eliminar(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const domicilioExistente = await dbService.obtenerDomicilio(id);
            if (!domicilioExistente) {
                return res.status(404).json({ 
                    error: 'Domicilio no encontrado',
                    detalle: `No existe un domicilio con ID ${id}`
                });
            }

            await dbService.eliminarDomicilio(id);
            res.json({ 
                message: 'Domicilio eliminado correctamente',
                domicilioId: id
            });
        } catch (error) {
            console.error('Error al eliminar domicilio:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al eliminar domicilio',
                detalle: 'Por favor intente nuevamente más tarde'
            });
        }
    }
}

export const domiciliosController = new DomiciliosController();