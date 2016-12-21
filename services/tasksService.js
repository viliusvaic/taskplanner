const mongo = require('./mongodbService');

const addNewTask = (request, reply) => {
    const task = {
        title: request.payload.title,
        description: request.payload.desc,
        user: request.payload.user,
        status: 'to do',
        count: 0,
    };
    mongo.insertItem('tasks', task, (inserted) => {
        reply(inserted);
    });
};

const getUserTasks = (request, reply) => {
    mongo.getUserTasks(request.query.user, (array) => {
        reply(array);
    });
};

const getOneTask = (request, reply) => {
    mongo.getOneTask(request.query.id, (item) => {
        reply(item);
    });
};

const editTask = (request, reply) => {
    const item = {
        id: request.payload.id,
        title: request.payload.title,
        description: request.payload.desc,
        status: request.payload.status,
    };
    mongo.editTask(item, (res) => {
        reply(res);
    });
};

const addSession = (request, reply) => {
    mongo.addSession(request.payload.id, () => {
        reply();
    });
};

const deleteTask = (request, reply) => {
    mongo.deleteTask(request.payload.id, () => {
        reply();
    });
};

module.exports = {
    addNewTask,
    getUserTasks,
    getOneTask,
    editTask,
    addSession,
    deleteTask,
};