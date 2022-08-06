const menuBtn = document.querySelector('.hamburger');
const navMobile = document.querySelector('.nav__mobile');

menuBtn.addEventListener('click', function () {
  menuBtn.classList.toggle('is-active');
  navMobile.classList.toggle('is-active');
});