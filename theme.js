// theme.js
document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;
    const navbar = document.querySelector(".navbar");
  
    themeToggle.addEventListener("click", function () {
      if (body.classList.contains("dark-theme")) {
        body.classList.remove("dark-theme");
        body.classList.add("light-theme");
        themeToggle.className = "bi bi-moon";
      } else {
        body.classList.remove("light-theme");
        body.classList.add("dark-theme");
        themeToggle.className = "bi bi-sun";
      }
    });
  
    // Initial theme setting based on previous choice or default to light theme
    if (localStorage.getItem("theme") === "dark") {
      body.classList.add("dark-theme");
      themeToggle.className = "bi bi-sun";
    } else {
      body.classList.add("light-theme");
      themeToggle.className = "bi bi-moon";
    }
  
    themeToggle.addEventListener("click", function () {
      if (body.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    });

    window.addEventListener("scroll", function () {
        if (window.scrollY > navbar.offsetTop) {
          navbar.classList.add("fixed-top");
        } else {
          navbar.classList.remove("fixed-top");
        }
      });
  });
  