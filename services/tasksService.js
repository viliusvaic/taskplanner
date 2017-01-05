const mongo = require('./mongodbService');

const addNewTask = (request, reply) => {
    const regTitle = /^[A-Za-z0-9,.()ąčęėįšųūžĄČĘĖĮŠŲŪŽ!? ]{0,100}$/;
    const regDesc = /^[A-Za-z0-9,.()ąčęėįšųūžĄČĘĖĮŠŲŪŽ!?\n ]{0,500}$/;
    const regExp = /^[0-9]{0,500}$/;
    const reg = /^[a-zA-Z0-9]{0,50}$/;

    if (regTitle.test(request.payload.title) && regDesc.test(request.payload.desc) && regExp.test(request.payload.exp)
            && reg.test(request.payload.user)) {
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
    } else {
        reply('did not pass validation');
    }
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
    const regTitle = /^[A-Za-z0-9,.()ąčęėįšųūžĄČĘĖĮŠŲŪŽ!? ]{0,100}$/;
    const regDesc = /^[A-Za-z0-9,.()ąčęėįšųūžĄČĘĖĮŠŲŪŽ!?\n ]{0,500}$/;

    if (regTitle.test(request.payload.title) && regDesc.test(request.payload.desc)) {
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
    } else {
        reply('did not pass validation');
    }
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