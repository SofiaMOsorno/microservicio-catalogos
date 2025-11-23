import { Router } from 'express';
import { domiciliosController } from '../controllers/domicilios.controller';

const router = Router();

// Rutas de domicilios
router.get('/', (req, res) => domiciliosController.obtenerTodos(req, res));
router.get('/:id', (req, res) => domiciliosController.obtenerPorId(req, res));
router.put('/:id', (req, res) => domiciliosController.actualizar(req, res));
router.delete('/:id', (req, res) => domiciliosController.eliminar(req, res));

export default router;