const bcrypt = require('bcryptjs');
const mongo = require('./mongodbService');
const req = require('request');

const saltRounds = 10;

const generateNavBar = (cookies) => {
    var htmlData = {};

    htmlData.head = '<head><title>Task Planner</title>' +
        '<meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">' +
        '<link rel="stylesheet" href="../public/CSS/bootstrap.min.css">' +
        '<link rel="stylesheet" href="../public/CSS/w3.css">' +
        '<script src="../public/JS/jquery.min.js"></script>' +
        '<script src="../public/JS/bootstrap.min.js"></script>' +
        '<link rel="stylesheet" href="../public/CSS/styles.css"></head>';


    htmlData.navbar = '<nav class="navbar navbar-default"><div class="container-fluid">' +
        '<div class="navbar-header"><a class="navbar-brand" href="/">Task Planner</a></div>' +
        '<ul class="nav navbar-nav">';

    if (cookies == undefined) {
        htmlData.navbar +=
            '<li><a style="cursor: pointer" data-toggle="modal" data-target="#registerModal"><span class="glyphicon glyphicon-user"></span> Register</a></li>' +
            '<li><a style="cursor: pointer" onclick="loginModal()"><span class="glyphicon glyphicon-log-in"></span> Log in</a></li>';
    } else if (cookies.logged && cookies.username && cookies.timer) {
        htmlData.username = cookies.username;
        htmlData.timer = cookies.timer;
    }
    htmlData.navbar += '</ul>';
    htmlData.navbar += '<ul class="nav navbar-nav navbar-right">';
    if (cookies != undefined) {
        htmlData.navbar += '<li class="dropdown">' +
            '<a class="dropdown-toggle" data-toggle="dropdown" href="#">Menu<span class="caret"></span></a>' +
            '<ul class="dropdown-menu">' +
            '<li><a class="pw-change" data-toggle="modal" data-target="#changePwModal">Change Password</a></li>' +
            '<li><a class="pw-change" onclick="changeSessionView()">Session length</a></li>' +
            '<li><a href="/logout">Log out</a></li>' +
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
    const reg = /[^a-zA-Z0-9]/;
    if (reg.test(request.payload['data[username]']) || reg.test(request.payload['data[password]'])) {
        reply('did not pass validation');
    }
    hashString(request.payload['data[password]'], (hashed) => {
        mongo.doesUserExist('users', request.payload['data[username]'], (res) => {
            if (!res) {
                mongo.insertItem('users', {
                    username: request.payload['data[username]'],
                    password: hashed,
                    session: 25
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
    const reg = /[^a-zA-Z0-9]/;
    if (reg.test(request.payload['data[username]']) || reg.test(request.payload['data[password]'])) {
        reply('did not pass validation');
    }
    const username = request.payload['data[username]'];
    const password = request.payload['data[password]'];
    mongo.getByUsername('users', username, (user) => {
        if (user != undefined) {
            checkMatch(password, user.password, (res) => {
                if (res) {
                    reply().state('cookies', {logged: true, username: user.username, timer: user.session});
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
    const reg = /[^a-zA-Z0-9]/;
    if (reg.test(request.payload.user) || reg.test(request.payload.oldpw) || reg.test(request.payload.newpw)) {
        reply('did not pass validation');
    }
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

const editTimer = (request, reply) => {
    mongo.updateSessionTimer(request.payload.user, request.payload.newTimer, () => {
        reply().state('cookies', {logged: true, username: request.payload.user, timer: request.payload.newTimer});
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

const socialItems = (request, reply) => {
    req(
        'https://funnel.tagboard.com/search/roadtrip?excluded_networks=instagram&count=25',
        (err, res, body) => {
            const r = JSON.parse(body);
            reply(r);
        }
    )
};

module.exports = {
    generateNavBar,
    register,
    login,
    logout,
    changePassword,
    editTimer,
    socialItems,
}