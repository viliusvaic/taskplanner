const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://testuser:testuser@ds163677.mlab.com:63677/heroku_9hhqvb1l';

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

const getUserTasks = (username, callback) => {
    MongoClient.connect(url, (err, db) => {
        db.collection('tasks').find({user: username}).toArray((err, res) => {
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

module.exports = {
    insertItem,
    doesUserExist,
    getByUsername,
    getUserTasks,
    getOneTask,
};