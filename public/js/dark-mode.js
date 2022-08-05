const body = document.getElementsByTagName("body")[0];
const h3 = document.getElementsByTagName("h3");
const darkModeBtn = document.getElementById("darkMode");
const desktopNav = document.querySelector(".nav__desktop");
const mobileNav = document.querySelector(".nav__mobile");
const inputs = document.getElementsByTagName("input");
const labels = document.getElementsByTagName("label");
const comments = document.querySelectorAll(".comment--right");
const table = document.querySelector('.admin__table');
const textareas = document.getElementsByTagName('textarea');
const selects = document.getElementsByTagName('select');
const pageLinks = document.querySelectorAll(".page-link");

const pageTitles = document.querySelectorAll(".page__title");

const taskTitles = document.querySelectorAll(".task__title");
const taskInfo = document.querySelectorAll(".task__submission--info");
const taskDesc = document.querySelectorAll(".task__desc");

const categories = document.querySelectorAll(".task__category");
const categorieHeaders = document.querySelectorAll(".task__category--header");
const categoriyTitles = document.querySelectorAll(".task__category--title");

const cards = document.querySelectorAll(".card");
const cardTitles = document.querySelectorAll(".card__title");
const taskComments = document.querySelectorAll(".card__comment--icon");
const taskCommentCounts = document.querySelectorAll(".card__comment--count");

const dueDates = document.querySelectorAll(".card__due-date");
const taskViewBtns = document.querySelectorAll(".tasks__view");
const viewAllTasksBtns = document.querySelectorAll(".tasks__view--all");

const authContainer = document.querySelectorAll(".auth");



const darkModeOn = () => {
  body.classList.add('dark');
  desktopNav.classList.add('dark__bg');
  mobileNav.classList.add('dark__bg');

  // for(let auth of authContainer) {
  //   auth.classList.add("dark__bg");
  // }

  for(let viewAllTask of viewAllTasksBtns) {
    viewAllTask.classList.add("dark__txt");
  }


  for(let viewBtn of taskViewBtns) {
    viewBtn.classList.add('dark__btn');
  }

  for(let card of cards) {
    card.classList.add('dark__bg');
  }

  for(let dueDate of dueDates) {
    dueDate.classList.add('dark__border--right');
  }

  for(let titles of categoriyTitles) {
    titles.classList.add('dark__bg');
  }

  for(let header of categorieHeaders) {
    header.classList.add('dark__bg--alt');
  }

  for(let category of categories) {
    category.classList.add('dark__bg--alt');
  }

  for(let input of inputs) {
    input.classList.add('dark__input');
  }

  for(let label of labels) {
    label.classList.add('dark__txt');
  }

  for(let comment of comments) {
    comment.classList.add("dark__bg");
  }

  for(let title of pageTitles) {
    title.classList.add("dark__txt");
  }

  for(let title of taskTitles) {
    title.classList.add("dark__txt");
  }

  for(let info of taskInfo) {
    info.classList.add("dark__txt");
  }

  for(let desc of taskDesc) {
    desc.classList.add("dark__txt");
  }

  for(let textarea of textareas) {
    textarea.classList.add("dark__input");
  }

  for(let pageLink of pageLinks) {
    pageLink.classList.add("page-link-dark");
  }

  for(let select of selects) {
    select.classList.add("dark__input");
  }

  if(table) {
    table.classList.add("admin__table-dark");
  }

}

const darkModeOff = () => {
  body.classList.remove('dark');
  desktopNav.classList.remove('dark__bg');
  mobileNav.classList.remove('dark__bg');

  for(let viewAllTask of viewAllTasksBtns) {
    viewAllTask.classList.remove("dark__txt");
  }
  for(let select of selects) {
    select.classList.remove("dark__input");
  }

  for(let viewBtn of taskViewBtns) {
    viewBtn.classList.remove('dark__btn');
  }

  for(let card of cards) {
    card.classList.remove('dark__bg');
  }

  for(let dueDate of dueDates) {
    dueDate.classList.remove('dark__border--right');
  }

  for(let titles of categoriyTitles) {
    titles.classList.remove('dark__bg');
  }

  for(let header of categorieHeaders) {
    header.classList.remove('dark__bg--alt');
  }

  for(let category of categories) {
    category.classList.remove('dark__bg--alt');
  }

  for(let input of inputs) {
    input.classList.remove('dark__input');
  }

  for(let label of labels) {
    label.classList.remove('dark__txt');
  }

  for(let comment of comments) {
    comment.classList.remove("dark__bg");
  }

  for(let title of pageTitles) {
    title.classList.remove("dark__txt");
  }

  for(let title of taskTitles) {
    title.classList.remove("dark__txt");
  }

  for(let info of taskInfo) {
    info.classList.remove("dark__txt");
  }

  for(let desc of taskDesc) {
    desc.classList.remove("dark__txt");
  }

  for(let textarea of textareas) {
    textarea.classList.remove("dark__input");
  }

  for(let pageLink of pageLinks) {
    pageLink.classList.remove("page-link-dark");
  }

  if(table) {
    table.classList.remove("admin__table-dark");
  }
}

window.onload = function() {
  const isDarkMode = JSON.parse(localStorage.getItem('darkMode'));
  if(isDarkMode) {
    darkModeOn();
  } else if(localStorage.getItem('darkMode') === false){
    darkModeOff();
  }
}

darkModeBtn.addEventListener("click", () => {
  const isDarkMode = JSON.parse(localStorage.getItem('darkMode'));
  if(isDarkMode) {
    localStorage.setItem("darkMode", false);
    darkModeOff();
    darkModeBtn.innerHTML = "<i class='bx bx-moon' ></i>"
  } else {
    localStorage.setItem("darkMode", true);
    darkModeOn();
    darkModeBtn.innerHTML = "<i class='bx bx-sun' ></i>"
  }
})
