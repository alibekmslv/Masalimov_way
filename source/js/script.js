'use strict';

const noJsElement = document.querySelector('.no-js');
noJsElement.classList.remove('no-js');

const menuButtonElement = document.querySelector('.menu-button');
const mainHeader = document.querySelector('.main-header');

menuButtonElement.addEventListener('click', () => {
  mainHeader.classList.toggle('main-header--open');
  menuButtonElement.classList.toggle('menu-button--open');
});
