document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");
  const mainContent = document.querySelector(".main-content");

  async function loadContent(url) {
    try {
      const response = await fetch(url);
      const content = await response.text();
      mainContent.innerHTML = content;
    } catch (error) {
      mainContent.innerHTML =
        "<p>Failed to load content. Please try again later.</p>";
    }
  }

  function activateLink(link) {
    navLinks.forEach((nav) => nav.classList.remove("active"));
    link.classList.add("active");
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const url = link.getAttribute("href");
      activateLink(this); // Changed 'link' to 'this' to refer to the clicked element
      loadContent(url);
    });
  });

  // Function to check for active link on page load and load its content
  function checkActiveLink() {
    const activeLink = document.querySelector(".nav-link.active");
    if (activeLink) {
      const url = activeLink.getAttribute("href");
      loadContent(url);
    }
  }

  // Call checkActiveLink immediately after defining it to load the dashboard by default
  checkActiveLink();
});
