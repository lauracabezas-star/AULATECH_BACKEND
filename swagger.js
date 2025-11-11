import swaggerAutogen from 'swagger-autogen'; 

const outputFile = './swagger.json';
const endPointsFiles = ['./src/app.js']

const doc = {
    info: {
        title: 'API AULATECH',
        description: 'Esta API permite gestionar y reservar equipos audiovisuales'
    },
    host: 'localhost:4001',
    schemes: ['http']
}

swaggerAutogen()(outputFile, endPointsFiles, doc);