import { Router } from 'express';
import { clientesController } from '../controllers/clientes.controller';
import { domiciliosController } from '../controllers/domicilios.controller';

const router = Router();

// Rutas de Clientes
router.post('/', (req, res) => clientesController.crear(req, res));
router.get('/', (req, res) => clientesController.obtenerTodos(req, res));
router.get('/:id', (req, res) => clientesController.obtenerPorId(req, res));
router.put('/:id', (req, res) => clientesController.actualizar(req, res));
router.delete('/:id', (req, res) => clientesController.eliminar(req, res));

// Rutas de domicilios
router.post('/:clienteId/domicilios', (req, res) => domiciliosController.crear(req, res));
router.get('/:clienteId/domicilios', (req, res) => domiciliosController.obtenerPorCliente(req, res));

export default router;