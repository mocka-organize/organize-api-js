import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Organize API',
    description: 'Api de reconhecimento facial'
  },
  host: 'localhost:3000'
};

const outputFile = './src/docs/swagger-output.json';
const routes = ['./index.js'];

swaggerAutogen()(outputFile, routes, doc);