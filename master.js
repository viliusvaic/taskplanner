const Hapi = require('hapi');
const Vision = require('vision');
const Inert = require('inert');

const userService = require('./services/usersService');

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

server.state('cookies', {
    ttl: 24 * 60 * 60 * 1000,
    isSecure: false,
    path: '/',
    encoding: 'base64json'
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
        const htmlData = userService.generateNavBar(request.state.cookies);
        reply.view('index.html', {htmlData});
    },
});

server.route({
    method: 'POST',
    path: '/register',
    handler: userService.register,
});

server.route({
    method: 'POST',
    path: '/login',
    handler: userService.login,
});

server.route({
    method: 'GET',
    path: '/logout',
    handler: userService.logout,
});

server.route({
    method: 'POST',
    path: '/addtask',
    handler: userService.addNewTask,
});

server.route({
    method: 'GET',
    path: '/getusertasks',
    handler: userService.getUserTasks,
});

server.route({
    method: 'GET',
    path: '/getonetask',
    handler: userService.getOneTask,
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});