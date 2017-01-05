var intId;

const startTimer = () => {
    document.getElementById('start-timer').innerHTML = 'Stop';
    document.getElementById('start-timer').setAttribute('onclick', 'stopTimer()');
    var duration = 60 * timerLength;
    var display = $('#timer');
    var timer = duration, minutes, seconds;
    intId = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text(minutes + ":" + seconds);

        if (--timer < 0) {
            var taskid = document.getElementById('edit-id').value;
            console.log(taskid);
            $.post('./addsession', {id: taskid}, () => {
                var prev = Number($('#poms').val());
                $('#poms').val(prev+1);
                $('#poms').html(`: ${prev+1}`);
                var p = $(`#${taskid}`).children('.snippet-foot').children('.counter');
                var prev = Number(p.html());
                p.html(prev+1);
                stopTimer();
            });
        }
    }, 1000);
};

const stopTimer = () => {
    clearInterval(intId);
    document.getElementById('start-timer').innerHTML = 'Start';
    document.getElementById('start-timer').setAttribute('onclick', 'startTimer()');
    document.getElementById('timer').innerHTML = '';
};

const register = () => {
    var data = {};
    data.username = document.getElementById('username-register').value;
    data.password = document.getElementById('pwd-register').value;
    data.conf = document.getElementById('pwd-register-conf').value;

    if (data.username == '' || data.password == '' || data.conf == '') {
        document.getElementById('register-error').innerHTML = "All fields are required.";
    } else if (data.password != data.conf) {
        document.getElementById('register-error').innerHTML = "Passwords do not match.";
    } else if ( /[^a-zA-Z0-9]/.test(data.username) || /[^a-zA-Z0-9]/.test(data.password)) {
        document.getElementById('register-error').innerHTML = "There are unallowed symbols";
    } else {
        $.post('./register', {data}, (result) => {
            if (result == 'username already exists') {
                document.getElementById('register-error').innerHTML = "This username already exists.";
            } else {
                location.reload();
            }
        });
    }
};

const loginModal = () => {
    $('#loginModal').modal('toggle');
    $(document).keyup((e) => {
        if ($('#loginModal').hasClass('in')) {
            if(e.which == 13) {
                $('#login-btn').click();
            }
        }
    });
};

const loginModalOff = () => {
    $('#loginModal').modal('toggle');
};

const login = () => {
    var data = {};
    data.username = document.getElementById('username-login').value;
    data.password = document.getElementById('pwd-login').value;

    if (data.username == '' || data.password == '') {
        document.getElementById('login-error').innerHTML = 'Please enter all fields.';
    } else {
        $.post('./login', {data}, (result) => {
            if (result == 'password is wrong') {
                document.getElementById('login-error').innerHTML = 'The password is incorrect';
            } else if (result == 'user doesnt exist') {
                document.getElementById('login-error').innerHTML = 'User does not exist';
            } else {
                location.reload();
            }
        });
    }
};

const changePassword = () => {
    const old = document.getElementById('old-pw').value;
    const newpw = document.getElementById('new-pw').value;
    const newpw2 = document.getElementById('new-pw2').value;

    if (old == '' || newpw == '' || newpw2 == ''){
        document.getElementById('change-error').innerHTML = 'Please enter all fields';
    } else if (newpw != newpw2) {
        document.getElementById('change-error').innerHTML = 'Passwords do not match';
    } else if (/[^a-zA-Z0-9]/.test(old) || /[^a-zA-Z0-9]/.test(newpw)) {
        document.getElementById('change-error').innerHTML = 'There are unallowed symbols.';
    } else {
        $.post('./changepassword', {user: user, oldpw: old, newpw: newpw}, (result) => {
            if (result == 'password is wrong') {
                document.getElementById('change-error').innerHTML = 'The password is incorrect';
            } else {
                $("#changePwModal").modal('toggle');
            }
        });
    }
};

const createNew = () => {
    $('#task-title').val('');
    $('#task-des').val('');
    $('#exp-sessions').val('');
    $("#createTaskModal").modal('toggle');
};

const newtask = () => {
    var title = document.getElementById('task-title').value;
    var description = document.getElementById('task-des').value;
    var expected = document.getElementById('exp-sessions').value;
    var regTitle = /^[A-Za-z0-9,.()ąčęėįšųūžĄČĘĖĮŠŲŪŽ!? ]{0,100}$/;
    var regDesc = /^[A-Za-z0-9,.()ąčęėįšųūžĄČĘĖĮŠŲŪŽ!?:\-\n ]{0,500}$/;
    var regExp = /^[0-9]{0,500}$/;
    if (title == '' || expected == '') {
        document.getElementById('create-error').innerHTML = "Please enter title and expected sessions";
    } else if (regTitle.test(title) && regDesc.test(description) && regExp.test(expected)) {
        $.post('./addtask', {user: user, title: title, desc: description, exp: expected}, (result) => {
            generateTaskSnippet(title, description, 'to do', result, '0');
            $(`#${result}`).on('click', (event) => {
                $.get('./getonetask', { id: event.target.id }, (item) => {
                    getDetailsModal(item);
                });
            });
            $("#createTaskModal").modal('toggle');
        });
    } else {
        document.getElementById('create-error').innerHTML = "There are unallowed symbols";
    }

};

const deleteTask = () => {
    var id = document.getElementById('edit-id').value;
    $.post('./deletetask', {id: id}, () => {
        $(`#${id}`).remove();
        $('#taskDetailsModal').modal('toggle');
    });
};

const generateTaskSnippet = (title, desc, status, id, cnt) => {
    var main = document.createElement('div');
    main.setAttribute('class', 'task');
    main.setAttribute('id', id);
    var titlediv = document.createElement('div');
    titlediv.setAttribute('class', 'title');
    var titleh = document.createElement('h2');
    titleh.setAttribute('class', 'title-txt');
    var titletxt = document.createTextNode(title);

    var descdiv = document.createElement('div');
    descdiv.setAttribute('class', 'descr');
    var descp = document.createElement('p');
    descp.setAttribute('class', 'descr-txt');
    var desctxt = document.createTextNode(desc);

    var foot = document.createElement('div');
    foot.setAttribute('class', 'snippet-foot');
    var icon = document.createElement('img');
    var count = document.createElement('p');
    var countNum = document.createTextNode(cnt);
    count.appendChild(countNum);
    count.setAttribute('class', 'counter');
    icon.setAttribute('src', '../public/icons/pomodoro-counter-empty.png');
    icon.setAttribute('class', 'pomodoro');
    foot.appendChild(count);
    foot.appendChild(icon);

    titleh.appendChild(titletxt);
    titlediv.appendChild(titleh);
    descp.appendChild(desctxt);
    descdiv.appendChild(descp);
    main.appendChild(titlediv);
    main.appendChild(descdiv);
    main.appendChild(foot);
    if (status == 'to do') {
        $(".add-btn").after(main);
    } else if (status == 'doing') {
        $("#doing-label").after(main);
    } else {
        $("#done-label").after(main);
    }
};

const edit = () => {
    const descHtml = '<div class="form-group" style="width: 100%" >' +
        '<textarea class="form-control" rows="5" id="edit-desc"></textarea>' +
        '</div>';
    const desc = document.getElementById('details-desc').innerHTML;
    $('#details-desc-cont').html(descHtml);
    $('#edit-desc').html(desc);

    const title = document.getElementById('details-title').innerHTML;
    $('#details-title').remove();
    var titleHtml = '';
    titleHtml += '<div id="title-edit" class="form-group">' +
        `<input type="text" class="form-control" id="edit-title-val" required="" value="${title}">` +
        '</div>';
    titleHtml += document.getElementById('details-header').innerHTML;
    $('#details-header').html(titleHtml);
};

const getDetailsModal = (item) => {
    $('#edit-id').val(item._id);
    var titleHtml = '';
    $('#title-edit').remove();
    $('#details-title').remove();

    document.getElementById('details-error').innerHTML = "";
    titleHtml += `<h4 id="details-title" class="modal-title">${item.title}</h4>` +
        document.getElementById('details-header').innerHTML;
    document.getElementById('details-header').innerHTML = titleHtml;
    const desc = `<p id="details-desc">${item.description}</p>`;
    $('#details-desc-cont').html(desc);

    document.getElementById('op1').removeAttribute('selected');
    document.getElementById('op2').removeAttribute('selected');
    document.getElementById('op3').removeAttribute('selected');
    if (item.status == 'to do') {
        document.getElementById('op1').setAttribute('selected', '1');
    } else if (item.status == 'doing') {
        document.getElementById('op2').setAttribute('selected', '1');
    } else {
        document.getElementById('op3').setAttribute('selected', '1');
    }

    $('#poms').html(`: ${item.count}`);
    $('#poms').val(item.count);
    $('#exp').html(`Exp: ${item.expected}`);
    $('#taskDetailsModal').modal('toggle');
};

const sendEditedTask = () => {
    const id = $('#edit-id').val();
    const title = $('#edit-title-val').val();
    const desc = $('#edit-desc').val();
    const status = $('#list-select').val();

    var regTitle = /^[A-Za-z0-9,.()ąčęėįšųūžĄČĘĖĮŠŲŪŽ!? ]{0,100}$/;
    var regDesc = /^[A-Za-z0-9,.()ąčęėįšųūžĄČĘĖĮŠŲŪŽ!?:\-\n ]{0,500}$/;

    if (title == '') {
        document.getElementById('details-error').innerHTML = "Please enter task title";
    } else if (regTitle.test(title) && regDesc.test(desc)) {
        $.post('./edittask', {id: id, title: title, desc: desc, status: status}, (res) => {
            $(`#${id}`).remove();
            generateTaskSnippet(res.title, res.description, res.status, res._id, res.count);
            $(`#${res._id}`).on('click', (event) => {
                $.get('./getonetask', { id: event.target.id }, (item) => {
                    getDetailsModal(item);
                });
            });
            $('#taskDetailsModal').modal('toggle');
        });
    } else {
        document.getElementById('details-error').innerHTML = "There are unallowed symbols";
    }
};

const changeSessionView = () => {
    $('#length-txt').text(`Current session length: ${timerLength}`);
    document.getElementById('timer-error').innerHTML = '';
    $('#changeTimerModal').modal('toggle');
};

const changeSessionLength = () => {
    const mins = Number(document.getElementById('new-timer').value);
    if (Number.isInteger(mins) && mins > 0) {
        $.post('./edittimer', {newTimer: mins, user: user}, (res) => {
            $('#changeTimerModal').modal('toggle');
            timerLength = mins;
        });
    } else {
        document.getElementById('timer-error').innerHTML = 'Bad data format';
    }
};

$(document).ready(() => {
    if (user == '') {
        loginModal();
    }
    $.get('./getusertasks', {user: user}, (result) => {
        result.forEach((item) => {
            generateTaskSnippet(item.title, item.description, item.status, item._id, item.count);
        });
        $(".task").on('click', (event) => {
            $.get('./getonetask', { id: event.target.id }, (item) => {
                getDetailsModal(item);
            });
        });
    });
});