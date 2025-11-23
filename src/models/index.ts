export interface Cliente {
    clienteId: string;
    razonSocial: string;
    nombreComercial: string;
    rfc: string;
    correoElectronico: string;
    telefono: string;
}

export interface Domicilio {
    domicilioId: string;
    clienteId: string;
    domicilio: string;
    colonia: string;
    municipio: string;
    estado: string;
    tipoDireccion: 'FACTURACION' | 'ENVIO';
}

export interface Producto {
    productoId: string;
    nombre: string;
    unidadMedida: string;
    precioBase: number;
}