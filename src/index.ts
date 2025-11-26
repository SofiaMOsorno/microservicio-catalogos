import express from 'express';
import * as dotenv from 'dotenv';
import clientesRoutes from './routes/clientes.routes';
import domiciliosRoutes from './routes/domicilios.routes';
import productosRoutes from './routes/productos.routes';
import { metricsMiddleware } from './middlewares/metrics.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(metricsMiddleware);

app.use('/api/clientes', clientesRoutes);
app.use('/api/domicilios', domiciliosRoutes);
app.use('/api/productos', productosRoutes);

app.get('/test', (req, res) => {
    res.status(500).json({ 
        error: 'Error forzado para prueba de alarma',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'UP',
        service: 'microservicio-catalogos',
        environment: process.env.NODE_ENV || 'local',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({ 
        message: 'Microservicio de Catálogos',
        version: '1.0.0'
    });
});

app.listen(PORT, () => {
    console.log(`Microservicio corriendo en puerto ${PORT}`);
});