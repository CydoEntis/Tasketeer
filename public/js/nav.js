const menuBtn = document.querySelector(".hamburger");

const mobileMenuBtn = document.querySelector(".nav__mobile")

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle('is-active');
  mobileMenuBtn.classList.toggle('is-active');
})

