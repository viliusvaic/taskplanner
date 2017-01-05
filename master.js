const Hapi = require('hapi');
const Vision = require('vision');
const Inert = require('inert');

const userService = require('./services/usersService');
const tasksService = require('./services/tasksService');

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
    handler: tasksService.addNewTask,
});

server.route({
    method: 'GET',
    path: '/getusertasks',
    handler: tasksService.getUserTasks,
});

server.route({
    method: 'GET',
    path: '/getonetask',
    handler: tasksService.getOneTask,
});

server.route({
    method: 'POST',
    path: '/edittask',
    handler: tasksService.editTask,
});

server.route({
    method: 'POST',
    path: '/addsession',
    handler: tasksService.addSession,
});

server.route({
    method: 'POST',
    path: '/deletetask',
    handler: tasksService.deleteTask,
});

server.route({
    method: 'POST',
    path: '/changepassword',
    handler: userService.changePassword,
});

server.route({
    method: 'POST',
    path: '/edittimer',
    handler: userService.editTimer,
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});