import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pet Adoption Management System API',
            version: '1.0.0',
            description: 'A comprehensive REST API for managing pet adoptions with user authentication, pet CRUD operations, and adoption application workflows.',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        './src/routes/*.js',
        './src/controllers/*.js',
        './routes/*.js',
        './controllers/*.js',
    ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

