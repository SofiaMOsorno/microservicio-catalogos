# Microservicio de Catálogos

Microservicio para gestión de catálogos: Clientes, Domicilios y Productos.

## Tecnologías

- Node.js
- TypeScript
- Express
- AWS DynamoDB
- AWS SDK v3

## Prerequisitos

- Node.js 20+
- AWS CLI configurado con credenciales
- DynamoDB con las tablas: `Clientes`, `Domicilios`, `Productos`

## Instalación
```bash
npm install
```

## Ejecución

### Modo desarrollo
```bash
npm run dev
```

### Modo producción
```bash
npm run build
npm start
```

### Con PM2
```bash
npm run build
pm2 start ecosystem.config.js
```

## Endpoints

### Clientes
- `POST /api/clientes` - Crear cliente
- `GET /api/clientes` - Obtener todos los clientes
- `GET /api/clientes/:id` - Obtener cliente por ID
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Domicilios (Sub-recurso de Clientes)
- `POST /api/clientes/:clienteId/domicilios` - Crear domicilio para un cliente
- `GET /api/clientes/:clienteId/domicilios` - Obtener domicilios de un cliente

### Domicilios (Operaciones generales)
- `GET /api/domicilios` - Obtener todos los domicilios
- `GET /api/domicilios/:id` - Obtener domicilio por ID
- `PUT /api/domicilios/:id` - Actualizar domicilio
- `DELETE /api/domicilios/:id` - Eliminar domicilio

### Productos
- `POST /api/productos` - Crear producto
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/:id` - Obtener producto por ID
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto

### Health Check
- `GET /health` - Verificar estado del servicio

## Variables de Entorno
```env
PORT=3001
NODE_ENV=development
AWS_REGION=us-east-1
AWS_PROFILE=default
CLIENTES_TABLE=Clientes
DOMICILIOS_TABLE=Domicilios
PRODUCTOS_TABLE=Productos
```

## Puerto

El servicio corre en el puerto `3001` por defecto.