// const {getparking } = require('./public/src/DB/test-connection.js');

/*!
* Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
*/
//
// Scripts
//
// eslint-disable-next-line no-unused-vars
// const indexButton = document.getElementById('indexButton')
// const createAccountBtn = document.getElementById('createAccountBtn')
console.log('Scripts loaded')

window.addEventListener('DOMContentLoaded', event => {
  const indexButton = document.getElementById('indexButton')
  const createAccountBtn = document.getElementById('createAccountBtn')
  const inputPassword = document.getElementById('inputPassword')
  const inputEmail = document.getElementById('inputEmail')
  const indexHeader = document.getElementById('indexHeader')

  if (indexButton) {
    indexButton.addEventListener('click', indexUser)
  }

  if (createAccountBtn) {
    createAccountBtn.addEventListener('click', createNewUser)
  }

  if (inputEmail) {
    inputEmail.addEventListener('click', () => {
      indexHeader.innerHTML = '<h3 id="indexHeader" class="text-center font-weight-light my-4">Login</h3>'
    })
  }

  if (inputPassword) {
    inputPassword.addEventListener('click', () => {
      indexHeader.innerHTML = '<h3 id="indexHeader" class="text-center font-weight-light my-4">Login</h3>'
    })
  }

  inputPassword.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      indexButton.click() // Simula el clic en el botón de index
      // Puedes acceder al valor con input.value
    }
  })

  const sidebarToggle = document.body.querySelector('#sidebarToggle')
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', event => {
      event.preventDefault()
      document.body.classList.toggle('sb-sidenav-toggled')
      // eslint-disable-next-line no-undef
      localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'))
    })
  }
})
async function indexUser () {
  const email = document.getElementById('inputEmail').value.trim()
  const password = document.getElementById('inputPassword').value.trim()
  const indexHeader = document.getElementById('indexHeader')

  const users = await getUsers()
  console.log("Usuarios cargados para login:", users)

  const foundUser = users.find(u => u.email === email && u.password === password)

  if (foundUser) {
    indexHeader.innerHTML = '<h3 id="indexHeader" class="text-center font-weight-light my-4" style="color: green;">Login successful!</h3>'
    localStorage.setItem('currentUser', JSON.stringify(foundUser))
    if (foundUser.role === 'admin') {
      localStorage.setItem('isAdmin', 'true')
      window.location.assign('./reserva.html')
    }else{
      localStorage.setItem('isAdmin', 'false')
      window.location.assign('./home.html')
    }
    
  } else {
    indexHeader.innerHTML = '<h3 id="indexHeader" class="text-center font-weight-light my-4" style="color: red;">Login failed!</h3>'
  }
}

function getUsers() {
  // Primero intenta leer de localStorage
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  // Si no hay, carga desde users.json y lo guarda en localStorage
  return fetch('./users.json')
    .then(res => res.json())
    .then(data => {
      localStorage.setItem('users', JSON.stringify(data));
      return data;
    });
}

async function createNewUser() {
  let users = await getUsers();

  const newUser = {
    name: document.getElementById('inputFirstName').value.trim(),
    lastName: document.getElementById('inputLastName').value.trim(),
    email: document.getElementById('inputEmail').value.trim(),
    password: document.getElementById('inputPassword').value.trim(),
    age: document.getElementById('inputAge').value,
    role: document.getElementById('inputRole').value
  };

  if (users.find(u => u.email === newUser.email)) {
    alert('This email is already registered!');
    return;
  }

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  alert('Registration successful!');
  window.location.assign('./index.html');
}



// indexButton.addEventListener('click', () => {
//   indexUser()
// })

// createAccountBtn.addEventListener('click', () => {
//   createNewUser()
// })
