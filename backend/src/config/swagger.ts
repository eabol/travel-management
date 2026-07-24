import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Gestión de Viáticos API',
      version: '1.0.0',
      description: 'Documentación oficial OpenAPI 3.0 para la API Interna de Viáticos y la API Externa Institucional Mock.'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local / Desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Introduce tu token JWT precedido por Bearer'
        }
      }
    }
  },
  apis: ['./src/api/**/*.ts', './dist/api/**/*.js']
};

export const swaggerSpec = swaggerJSDoc(options);
