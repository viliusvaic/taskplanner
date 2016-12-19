const Hapi = require('hapi');
const Vision = require('vision');
const Inert = require('inert');

const server = new Hapi.Server();

server.connection({
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3000,
});

server.register(Vision, () => {});
server.register(Inert, () => {});

server.views({
    path: './templates',
    engines: {
        html: require('handlebars'),
    },
});

server.route({
    method: 'GET',
    path: '/public/{path*}',
    handler: {
        directory: {
            path: './public',
            listing: false,
            index: false,
        },
    },
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        reply('works');
    },
});


server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});