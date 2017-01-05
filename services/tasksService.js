const mongo = require('./mongodbService');

const addNewTask = (request, reply) => {
    const modifiedTime = new Date().getTime();
    const task = {
        title: request.payload.title,
        description: request.payload.desc,
        user: request.payload.user,
        status: 'to do',
        count: 0,
        expected: request.payload.exp,
        lastModified: modifiedTime,
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
    const dateModified = new Date().getTime();
    const item = {
        id: request.payload.id,
        title: request.payload.title,
        description: request.payload.desc,
        status: request.payload.status,
        lastModified: dateModified,
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