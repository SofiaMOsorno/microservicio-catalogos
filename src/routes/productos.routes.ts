import { Router } from 'express';
import { productosController } from '../controllers/productos.controller';

const router = Router();

// Rutas de poductos
router.post('/', (req, res) => productosController.crear(req, res));
router.get('/', (req, res) => productosController.obtenerTodos(req, res));
router.get('/:id', (req, res) => productosController.obtenerPorId(req, res));
router.put('/:id', (req, res) => productosController.actualizar(req, res));
router.delete('/:id', (req, res) => productosController.eliminar(req, res));

export default router;