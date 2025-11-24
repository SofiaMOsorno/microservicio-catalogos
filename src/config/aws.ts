import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import * as dotenv from 'dotenv';

dotenv.config();

const awsConfig = {
    region: process.env.AWS_REGION || 'us-east-1'
};

const dynamoClient = new DynamoDBClient(awsConfig);
export const docClient = DynamoDBDocumentClient.from(dynamoClient);

export const config = {
    clientesTable: process.env.CLIENTES_TABLE || 'Clientes',
    domiciliosTable: process.env.DOMICILIOS_TABLE || 'Domicilios',
    productosTable: process.env.PRODUCTOS_TABLE || 'Productos'
};