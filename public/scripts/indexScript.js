const tbody = document.querySelector('tbody');

async function GetUsers() {
    const response = await fetch('/api/users', {
        method: 'GET',
        headers: { 'accept': 'application/json' }
    });
    if (response.ok === true) {
        const users = await response.json();
        users.forEach(user => {
            tbody.append(row(user));
        });
    }
}

// получение одного пользователя
async function GetUser(id) {
    const response = await fetch('/api/users/' + id, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
    });
    if (response.ok === true) {
        const user = await response.json();
        const form = document.forms['userForm'];
        form.elements['id'].value = user.id;
        form.elements['name'].value = user.name;
        form.elements['age'].value = user.age;
    }
}

//добавление пользователя
async function CreateUser(userName, userAge) {
    const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: userName,
            age: parseInt(userAge, 10)
        })
    });
    if (response.ok === true) {
        const user = await response.json();
        reset();
        tbody.append(row(user));
    }
}

//изменение пользователя
async function EditUser(userId, userName, userAge) {
    const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: userId,
            name: userName,
            age: parseInt(userAge, 10)
        })
    });
    if (response.ok === true) {
        const user = await response.json();
        reset();
        document.querySelector(`tr[data-rowid="${user.id}"]`).replaceWith(row(user));    
    }
}

//удаление пользователя
async function DeleteUser(id) {
    const response = await fetch('/api/users/' + id, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
    });
    if (response.ok === true) {
        const user = await response.json();
        document.querySelector(`tr[data-rowid="${user.id}"]`).remove();
    }
}

//сброс формы
function reset() {
    const form = document.forms['userForm'];
    console.log(form);
    form.reset();
    form.elements['id'].value = 0;
}

//строка для таблицы
function row(user) {
    
    const tr = document.createElement('tr');
    tr.setAttribute('data-rowid', user.id);

    const idTd = document.createElement('td');
    idTd.append(user.id);
    tr.append(idTd);

    const nameTd = document.createElement('td');
    nameTd.append(user.name);
    tr.append(nameTd);

    const ageTd = document.createElement('td');
    ageTd.append(user.age);
    tr.append(ageTd);

    const linksTd = document.createElement('td');

    const editLink = document.createElement('a');
    editLink.setAttribute('data-id', user.id);
    editLink.setAttribute('class', 'btn');
    editLink.append('Изменить');
    editLink.addEventListener('click', e => {
        e.preventDefault();
        GetUser(user.id);
    });
    linksTd.append(editLink);
        
    const removeLink = document.createElement('a');
    removeLink.setAttribute('data-id', user.id);
    removeLink.setAttribute('class', 'btn');
    removeLink.append('Удалить');
    removeLink.addEventListener('click', e => {
        e.preventDefault();
        DeleteUser(user.id);
    });
        
    linksTd.append(removeLink);
    tr.appendChild(linksTd);

    return tr;
}

// сброс значений формы
document.getElementById('resetBtn').addEventListener('click', e => {
    e.preventDefault();
    reset();
});

// отправка
document.forms['userForm'].addEventListener('submit', e => {
    e.preventDefault();
    const form = document.forms['userForm'];
    const id = form.elements['id'].value;
    const name = form.elements['name'].value;
    const age = form.elements['age'].value;
    if (id == 0)
        CreateUser(name, age);
    else
        EditUser(id, name, age);
});

// загрузка пользователей
GetUsers();