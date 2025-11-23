import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbService } from '../services/db.service';
import { Cliente } from '../models';

function validarRFC(rfc: string): boolean {
    if (rfc.length !== 13) return false;
    
    const letras = rfc.substring(0, 4);
    if (!/^[A-Z]{4}$/.test(letras)) return false;
    
    const numeros = rfc.substring(4, 10);
    if (!/^\d{6}$/.test(numeros)) return false;
    
    const homoclave = rfc.substring(10, 13);
    if (!/^[A-Z0-9]{3}$/.test(homoclave)) return false;
    
    return true;
}

export class ClientesController {
    async crear(req: Request, res: Response) {
        try {
            const { razonSocial, nombreComercial, rfc, correoElectronico, telefono } = req.body;

            if (!razonSocial || !nombreComercial || !rfc || !correoElectronico || !telefono) {
                return res.status(400).json({ 
                    error: 'Faltan campos obligatorios',
                    campos_requeridos: ['razonSocial', 'nombreComercial', 'rfc', 'correoElectronico', 'telefono']
                });
            }

            const rfcUpperCase = rfc.toUpperCase();
            if (!validarRFC(rfcUpperCase)) {
                return res.status(400).json({ 
                    error: 'RFC inválido',
                    detalle: 'El RFC debe tener 13 caracteres: 4 letras, 6 números (fecha) y 3 caracteres alfanuméricos'
                });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correoElectronico)) {
                return res.status(400).json({ 
                    error: 'Correo electrónico inválido',
                    detalle: 'Proporciona un correo electrónico válido'
                });
            }

            const clienteExistente = await dbService.obtenerClientePorRFC(rfcUpperCase);
            if (clienteExistente) {
                return res.status(409).json({ 
                    error: 'Cliente ya existe',
                    detalle: `Ya existe un cliente registrado con el RFC ${rfcUpperCase}`
                });
            }

            const cliente: Cliente = {
                clienteId: uuidv4(),
                razonSocial,
                nombreComercial,
                rfc: rfcUpperCase,
                correoElectronico,
                telefono
            };

            await dbService.crearCliente(cliente);
            res.status(201).json({
                message: 'Cliente creado exitosamente',
                cliente
            });
        } catch (error) {
            console.error('Error al crear cliente:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al crear cliente',
                detalle: 'Por favor intente nuevamente más tarde'
            });
        }
    }

    async obtenerTodos(req: Request, res: Response) {
        try {
            const clientes = await dbService.obtenerTodosClientes();
            
            res.json({
                message: 'Clientes obtenidos exitosamente',
                total: clientes.length,
                clientes
            });
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al obtener clientes',
                detalle: 'Por favor intente nuevamente más tarde'
            });
        }
    }

    async obtenerPorId(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            const cliente = await dbService.obtenerCliente(id);

            if (!cliente) {
                return res.status(404).json({ 
                    error: 'Cliente no encontrado',
                    detalle: `No existe un cliente con ID ${id}`
                });
            }

            res.json({
                message: 'Cliente obtenido exitosamente',
                cliente
            });
        } catch (error) {
            console.error('Error al obtener cliente:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al obtener cliente',
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

            const clienteExistente = await dbService.obtenerCliente(id);
            if (!clienteExistente) {
                return res.status(404).json({ 
                    error: 'Cliente no encontrado',
                    detalle: `No existe un cliente con ID ${id}`
                });
            }

            if (datos.rfc) {
                const rfcUpperCase = datos.rfc.toUpperCase();
                if (!validarRFC(rfcUpperCase)) {
                    return res.status(400).json({ 
                        error: 'RFC inválido',
                        detalle: 'El RFC debe tener 13 caracteres: 4 letras, 6 números (fecha) y 3 caracteres alfanuméricos'
                    });
                }
                datos.rfc = rfcUpperCase;

                if (rfcUpperCase !== clienteExistente.rfc) {
                    const otroCliente = await dbService.obtenerClientePorRFC(rfcUpperCase);
                    if (otroCliente) {
                        return res.status(409).json({ 
                            error: 'RFC ya en uso',
                            detalle: `El RFC ${rfcUpperCase} ya está registrado en otro cliente`
                        });
                    }
                }
            }

            if (datos.correoElectronico) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(datos.correoElectronico)) {
                    return res.status(400).json({ 
                        error: 'Correo electrónico inválido'
                    });
                }
            }

            await dbService.actualizarCliente(id, datos);
            res.json({ 
                message: 'Cliente actualizado correctamente',
                clienteId: id
            });
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al actualizar cliente',
                detalle: 'Por favor intente nuevamente más tarde'
            });
        }
    }

    async eliminar(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const clienteExistente = await dbService.obtenerCliente(id);
            if (!clienteExistente) {
                return res.status(404).json({ 
                    error: 'Cliente no encontrado',
                    detalle: `No existe un cliente con ID ${id}`
                });
            }

            const domicilios = await dbService.obtenerDomiciliosPorCliente(id);
            if (domicilios && domicilios.length > 0) {
                return res.status(409).json({ 
                    error: 'No se puede eliminar el cliente',
                    detalle: `El cliente tiene ${domicilios.length} domicilio(s) asociado(s). Elimínelos primero.`
                });
            }

            await dbService.eliminarCliente(id);
            res.json({ 
                message: 'Cliente eliminado correctamente',
                clienteId: id
            });
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al eliminar cliente',
                detalle: 'Por favor intente nuevamente más tarde'
            });
        }
    }
}

export const clientesController = new ClientesController();