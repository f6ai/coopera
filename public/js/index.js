/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login__container');
const logOutBtn = document.querySelector('.nav--logout');
console.log(logOutBtn);

// DELEGATION
if (mapBox) {
  const loc = JSON.parse(mapBox.dataset.location);
  // lng first lat second
  const location = [loc.coordinates[1], loc.coordinates[0]];
  displayMap(location);
}

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email--login').value;
    const password = document.getElementById('pass--login').value;
    login(email, password);
  });

if (logOutBtn) {
  console.log('logout btn activated');
  logOutBtn.addEventListener('click', logout);
}
