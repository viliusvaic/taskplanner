const bcrypt = require('bcryptjs');
const mongo = require('./mongodbService');

const saltRounds = 10;

const generateNavBar = (cookies) => {
    var htmlData = {};

    htmlData.head = '<head><title>Task Planner</title>' +
        '<meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">' +
        '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">' +
        '<link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css">' +
        '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>' +
        '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>' +
        '<link rel="stylesheet" href="../public/CSS/styles.css"></head>';


    htmlData.navbar = '<nav class="navbar navbar-default"><div class="container-fluid">' +
        '<div class="navbar-header"><a class="navbar-brand" href="/">Task Planner</a></div>' +
        '<ul class="nav navbar-nav">';

    if (cookies == undefined) {
        htmlData.navbar +=
            '<li><a style="cursor: pointer" data-toggle="modal" data-target="#registerModal"><span class="glyphicon glyphicon-user"></span> Register</a></li>' +
            '<li><a style="cursor: pointer" data-toggle="modal" data-target="#loginModal"><span class="glyphicon glyphicon-log-in"></span> Log in</a></li>';
    } else if (cookies.logged && cookies.username) {
        htmlData.username = cookies.username;
    }
    htmlData.navbar += '</ul>';
    htmlData.navbar += '<ul class="nav navbar-nav navbar-right">';
    if (cookies != undefined) {
        htmlData.navbar += '<li class="dropdown">' +
            '<a class="dropdown-toggle" data-toggle="dropdown" href="#">Menu<span class="caret"></span></a>' +
            '<ul class="dropdown-menu">' +
            '<li><a href="/logout">Log out</a></li>' +
            '<li><a class="pw-change" data-toggle="modal" data-target="#changePwModal">Change Password</a></li>' +
            '</ul></li>';
    }
    htmlData.navbar += '</div></nav>';


    if (cookies != undefined) {
        if (cookies.logged && cookies.username) {
            htmlData.body = '<div id="main-container">' +
                '<div id="todo-list" class="sub-cont">' +
                '<h1>To do:</h1>' +
                '<button class="add-btn" onclick="createNew()">' +
                'Add new task' +
                '</button>' +
                '</div>' +
                '<div id="doing-list" class="sub-cont">' +
                '<h1 id="doing-label">Doing:</h1>' +
                '</div>' +
                '<div id="done-list" class="sub-cont">' +
                '<h1 id="done-label">Done:</h1>' +
                '</div>' +
                '</div>';
        }
    }
    return htmlData;
};

const register = (request, reply) => {
    hashString(request.payload['data[password]'], (hashed) => {
        mongo.doesUserExist('users', request.payload['data[username]'], (res) => {
            if (!res) {
                mongo.insertItem('users', {
                    username: request.payload['data[username]'],
                    password: hashed
                }, () => {
                    reply();
                });
            } else {
                reply('username already exists');
            }
        });

    });
};

const login = (request, reply) => {
    const username = request.payload['data[username]'];
    const password = request.payload['data[password]'];
    mongo.getByUsername('users', username, (user) => {
        if (user != undefined) {
            checkMatch(password, user.password, (res) => {
                if (res) {
                    reply().state('cookies', {logged: true, username: user.username});
                } else {
                    reply('password is wrong');
                }
            });
        } else {
            reply('user doesnt exist');
        }
    });
};

const logout = (request, reply) => {
    reply().redirect('/').unstate('cookies');
};

const changePassword = (request, reply) => {
    mongo.getByUsername('users', request.payload.user, (user) => {
        if (user != undefined) {
            checkMatch(request.payload.oldpw, user.password, (res) => {
                if (res) {
                    hashString(request.payload.newpw, (hashed) => {
                        mongo.changePassword(request.payload.user, hashed, () => {
                            reply();
                        });
                    });
                } else {
                    reply('password is wrong');
                }
            });
        }
    });
};

const hashString = (myString, callback) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(myString, salt, (error, hash) => {
            callback(hash);
        });
    });
};

const checkMatch = (plainString, hashedString, callback) => {
    bcrypt.compare(plainString, hashedString, (err, res) => {
        callback(res);
    });
};


module.exports = {
    generateNavBar,
    register,
    login,
    logout,
    changePassword,
}