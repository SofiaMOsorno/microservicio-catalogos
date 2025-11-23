import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, config } from '../config/aws';
import { Cliente, Domicilio, Producto } from '../models';

export class DBService {
    // ==================== CLIENTES ====================
    async crearCliente(cliente: Cliente): Promise<Cliente> {
        await docClient.send(new PutCommand({
            TableName: config.clientesTable,
            Item: cliente
        }));
        return cliente;
    }

    async obtenerCliente(clienteId: string): Promise<Cliente | null> {
        const result = await docClient.send(new GetCommand({
            TableName: config.clientesTable,
            Key: { clienteId }
        }));
        return result.Item as Cliente || null;
    }

    async obtenerClientePorRFC(rfc: string): Promise<Cliente | null> {
        const result = await docClient.send(new ScanCommand({
            TableName: config.clientesTable,
            FilterExpression: 'rfc = :rfc',
            ExpressionAttributeValues: { ':rfc': rfc }
        }));
        return result.Items && result.Items.length > 0 ? result.Items[0] as Cliente : null;
    }

    async obtenerTodosClientes(): Promise<Cliente[]> {
        const result = await docClient.send(new ScanCommand({
            TableName: config.clientesTable
        }));
        return (result.Items as Cliente[]) || [];
    }

    async actualizarCliente(clienteId: string, datos: Partial<Cliente>): Promise<void> {
        const updateExpression: string[] = [];
        const expressionAttributeNames: Record<string, string> = {};
        const expressionAttributeValues: Record<string, any> = {};

        for (const [key, value] of Object.entries(datos)) {
            if (key !== 'clienteId') {
                updateExpression.push(`#${key} = :${key}`);
                expressionAttributeNames[`#${key}`] = key;
                expressionAttributeValues[`:${key}`] = value;
            }
        }

        if (updateExpression.length === 0) return;

        await docClient.send(new UpdateCommand({
            TableName: config.clientesTable,
            Key: { clienteId },
            UpdateExpression: `SET ${updateExpression.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues
        }));
    }

    async eliminarCliente(clienteId: string): Promise<void> {
        await docClient.send(new DeleteCommand({
            TableName: config.clientesTable,
            Key: { clienteId }
        }));
    }

    // ==================== DOMICILIOS ====================
    async crearDomicilio(domicilio: Domicilio): Promise<Domicilio> {
        await docClient.send(new PutCommand({
            TableName: config.domiciliosTable,
            Item: domicilio
        }));
        return domicilio;
    }

    async obtenerDomicilio(domicilioId: string): Promise<Domicilio | null> {
        const result = await docClient.send(new GetCommand({
            TableName: config.domiciliosTable,
            Key: { domicilioId }
        }));
        return result.Item as Domicilio || null;
    }

    async obtenerDomiciliosPorCliente(clienteId: string): Promise<Domicilio[]> {
        const result = await docClient.send(new ScanCommand({
            TableName: config.domiciliosTable,
            FilterExpression: 'clienteId = :clienteId',
            ExpressionAttributeValues: { ':clienteId': clienteId }
        }));
        return (result.Items as Domicilio[]) || [];
    }

    async obtenerTodosDomicilios(): Promise<Domicilio[]> {
        const result = await docClient.send(new ScanCommand({
            TableName: config.domiciliosTable
        }));
        return (result.Items as Domicilio[]) || [];
    }

    async actualizarDomicilio(domicilioId: string, datos: Partial<Domicilio>): Promise<void> {
        const updateExpression: string[] = [];
        const expressionAttributeNames: Record<string, string> = {};
        const expressionAttributeValues: Record<string, any> = {};

        for (const [key, value] of Object.entries(datos)) {
            if (key !== 'domicilioId' && key !== 'clienteId') {
                updateExpression.push(`#${key} = :${key}`);
                expressionAttributeNames[`#${key}`] = key;
                expressionAttributeValues[`:${key}`] = value;
            }
        }

        if (updateExpression.length === 0) return;

        await docClient.send(new UpdateCommand({
            TableName: config.domiciliosTable,
            Key: { domicilioId },
            UpdateExpression: `SET ${updateExpression.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues
        }));
    }

    async eliminarDomicilio(domicilioId: string): Promise<void> {
        await docClient.send(new DeleteCommand({
            TableName: config.domiciliosTable,
            Key: { domicilioId }
        }));
    }

    // ==================== PRODUCTOS ====================
    async crearProducto(producto: Producto): Promise<Producto> {
        await docClient.send(new PutCommand({
            TableName: config.productosTable,
            Item: producto
        }));
        return producto;
    }

    async obtenerProducto(productoId: string): Promise<Producto | null> {
        const result = await docClient.send(new GetCommand({
            TableName: config.productosTable,
            Key: { productoId }
        }));
        return result.Item as Producto || null;
    }

    async obtenerTodosProductos(): Promise<Producto[]> {
        const result = await docClient.send(new ScanCommand({
            TableName: config.productosTable
        }));
        return (result.Items as Producto[]) || [];
    }

    async actualizarProducto(productoId: string, datos: Partial<Producto>): Promise<void> {
        const updateExpression: string[] = [];
        const expressionAttributeNames: Record<string, string> = {};
        const expressionAttributeValues: Record<string, any> = {};

        for (const [key, value] of Object.entries(datos)) {
            if (key !== 'productoId') {
                updateExpression.push(`#${key} = :${key}`);
                expressionAttributeNames[`#${key}`] = key;
                expressionAttributeValues[`:${key}`] = value;
            }
        }

        if (updateExpression.length === 0) return;

        await docClient.send(new UpdateCommand({
            TableName: config.productosTable,
            Key: { productoId },
            UpdateExpression: `SET ${updateExpression.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues
        }));
    }

    async eliminarProducto(productoId: string): Promise<void> {
        await docClient.send(new DeleteCommand({
            TableName: config.productosTable,
            Key: { productoId }
        }));
    }
}

export const dbService = new DBService();