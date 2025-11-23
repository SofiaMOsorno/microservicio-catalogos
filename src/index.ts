import express from 'express';
import * as dotenv from 'dotenv';
import clientesRoutes from './routes/clientes.routes';
import domiciliosRoutes from './routes/domicilios.routes';
import productosRoutes from './routes/productos.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Rutas
app.use('/api/clientes', clientesRoutes);
app.use('/api/domicilios', domiciliosRoutes);
app.use('/api/productos', productosRoutes);

// Ruta de health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'UP',
        service: 'microservicio-catalogos',
        timestamp: new Date().toISOString()
    });
});

// Ruta raíz
app.get('/', (req, res) => {
    res.json({ 
        message: 'Microservicio de Catálogos - API REST',
        version: '1.0.0',
        endpoints: {
            clientes: '/api/clientes',
            domicilios: '/api/domicilios',
            productos: '/api/productos',
            health: '/health'
        }
    });
});

app.listen(PORT, () => {
    console.log(`Microservicio de Catálogos corriendo en http://localhost:${PORT}`);
    console.log(`Documentación: http://localhost:${PORT}/`);
    console.log(`Health Check: http://localhost:${PORT}/health`);
});