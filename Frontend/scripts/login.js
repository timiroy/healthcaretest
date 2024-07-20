const formOpenBtn = document.querySelector("#form-open"),
  home = document.querySelector(".home"),
  formContainer = document.querySelector(".form_container"),
  formCloseBtn = document.querySelector(".form_close"),
  signup = document.querySelector("#signup"),
  login = document.querySelector("#login"),
  signup_btn = document.querySelector("#signup-btn");
login_btn = document.querySelector("#login-btn");
pwShowHide = document.querySelectorAll(".pw_hide");

// Function to handle successful login and redirect to dashboard
function redirectToDashboard() {
  window.location.href = "../../Frontend/pages/sidebar.html";
}

formOpenBtn.addEventListener("click", () => home.classList.add("show"));
formCloseBtn.addEventListener("click", () => home.classList.remove("show"));

pwShowHide.forEach((icon) => {
  icon.addEventListener("click", () => {
    let getPwInput = icon.parentElement.querySelector("input");
    if (getPwInput.type === "password") {
      getPwInput.type = "text";
      icon.classList.replace("uil-eye-slash", "uil-eye");
    } else {
      getPwInput.type = "password";
      icon.classList.replace("uil-eye", "uil-eye-slash");
    }
  });
});

signup.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.add("active");
});

login.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("clicked");
  // Mock login success - replace this with actual login logic
  redirectToDashboard(); // Redirect to dashboard upon successful login
});

signup_btn.addEventListener("click", (e) => {
  e.preventDefault();
  redirectToDashboard();
  // formContainer.classList.add("active");
});

login_btn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("clicked");
  // Mock login success - replace this with actual login logic
  redirectToDashboard(); // Redirect to dashboard upon successful login
});
