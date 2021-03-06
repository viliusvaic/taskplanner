const MongoClient = require('mongodb').MongoClient;
//const url = 'mongodb://testuser:testuser@ds163677.mlab.com:63677/heroku_9hhqvb1l';
const url = 'mongodb://localhost:27017/testdb';

var ObjectId = require('mongodb').ObjectId;

const insertItem = (collection, item, callback) => {
    MongoClient.connect(url, (err, db) => {
        db.collection(collection).insertOne(item, () => {
            const id = item._id;
            callback(id);
        });
    });
};

const doesUserExist = (collection, username, callback) => {
    MongoClient.connect(url, (err, db) => {
        db.collection(collection).find({username: username}).toArray((err, res) => {
            if (res.length > 0) {
                callback(true);
            } else {
                callback(false);
            }
        });
    });
};

const getByUsername = (collection, username, callback) => {
    MongoClient.connect(url, (err, db) => {
        db.collection(collection).find({username: username}).toArray((err, res) => {
            callback(res[0]);
        });
    });
};

const changePassword = (username, pw, callback) => {
    MongoClient.connect(url, (err, db) => {
        db.collection('users').update(
            {username: username},
            {
                $set: {password: pw}
            }, () => {
                callback();
            }
        );
    });
};

const getUserTasks = (username, callback) => {
    MongoClient.connect(url, (err, db) => {
        db.collection('tasks').find({user: username}).sort({lastModified: 1}).toArray((err, res) => {
            callback(res);
        });
    });
};

const getOneTask = (id, callback) => {
    MongoClient.connect(url, (err, db) => {
        db.collection('tasks').find({"_id": ObjectId(id)}).toArray((err, res) => {
            callback(res[0]);
        });
    });
};

const editTask = (item, callback) => {
    MongoClient.connect(url, (err, db) => {
        if (item.title != undefined && item.description != undefined) {
            db.collection('tasks').update(
                {_id: ObjectId(item.id)},
                {
                    $set: {
                        title: item.title,
                        description: item.description,
                        status: item.status,
                        lastModified: item.lastModified,
                    }
                }, () => {
                    db.collection('tasks').find({_id: ObjectId(item.id)}).toArray((err, res) => {
                        callback(res[0])
                    });
                }
            );
        } else {
            db.collection('tasks').update(
                {_id: ObjectId(item.id)},
                {
                    $set: {
                        status: item.status,
                        lastModified: item.lastModified,
                    }
                }, () => {
                    db.collection('tasks').find({_id: ObjectId(item.id)}).toArray((err, res) => {
                        callback(res[0])
                    });
                }
            );
        }
    });
};

const addSession = (id, callback) => {
    MongoClient.connect(url, (err, db) => {
        db.collection('tasks').update(
            {_id: ObjectId(id)},
            {
                $inc: {
                    count: 1,
                }
            }, () => {
                db.collection('tasks').find({_id: ObjectId(id)}).toArray((err, res) => {
                    callback(res[0])
                });
            }, () => {
                callback();
            }
        )
    });
};

const deleteTask = (id, callback) => {
    MongoClient.connect(url, (err, db) => {
        db.collection('tasks').removeOne(
            {_id: ObjectId(id)}, () => {
                callback();
            }
        );
    });
};

const updateSessionTimer = (username, timer, callback) => {
    MongoClient.connect(url, (err, db) => {
        db.collection('users').update(
            {username: username},
            {
                $set: {session: timer}
            }, () => {
                callback();
            }
        );
    });
};

module.exports = {
    insertItem,
    doesUserExist,
    getByUsername,
    getUserTasks,
    getOneTask,
    editTask,
    addSession,
    deleteTask,
    changePassword,
    updateSessionTimer,
};