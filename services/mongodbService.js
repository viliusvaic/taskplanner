const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://testuser:testuser@ds163677.mlab.com:63677/heroku_9hhqvb1l';

const insertItem = (collection, item, callback) => {
    MongoClient.connect(url, (err, db) => {
        db.collection(collection).insertOne(item);
    });
    callback();
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

module.exports = {
    insertItem,
    doesUserExist,
    getByUsername,
};