const formOpenBtn = document.querySelector("#form-open"),
  home = document.querySelector(".home"),
  formContainer = document.querySelector(".form_container"),
  formCloseBtn = document.querySelector(".form_close"),
  signup = document.querySelector("#signup"),
  login = document.querySelector("#login"),
  pwShowHide = document.querySelectorAll(".pw_hide");

const signup_btn = document.getElementById("signup-btn");
const login_btn = document.getElementById("login-btn");
const emailLogin = document.getElementById("emailLogin");
const passwordLogin = document.getElementById("passwordLogin");

const emailSignup = document.getElementById("emailSignUp");
const firstNameSignup = document.getElementById("fnSignUp");
const lastNameSignup = document.getElementById("lnSignUp");
const phoneSignup = document.getElementById("phoneSignUp");
const passwordSignUp = document.getElementById("passwordSignUp");
const confirmPasswordSignUp = document.getElementById("confirmPasswordSignUp");

let emailInput;
let passwordInput;

let emailSignUpInput;
let firstNameInput;
let lastNameInput;
let phoneInput;
let passwordSignUpInput;
let confirmPasswordInput;

const url = `http://18.117.225.244/v1/auth/signin`;
const signUp_url = `http://18.117.225.244/v1/auth/signup`;

async function loginAuth() {
  console.log("login   .....");

  const payload = { email: emailInput, password: passwordInput };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (response.ok) {
      sessionStorage.setItem("authDetails", JSON.stringify(data));
      window.location.href = "../../Frontend/pages/sidebar.html";
    }

    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function signUpAuth() {
  console.log("signup   .....");

  const payload = {
    email: emailSignUpInput,
    password: passwordSignUpInput,
    first_name: firstNameInput,
    last_name: lastNameInput,
    user_type: "PATIENT",
    profile_img: "",
    phone_number: phoneInput,
    address: "Lagos",
    gender: "Transgender",
    date_of_birth: new Date(),
  };
  try {
    const response = await fetch(signUp_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (response.ok) {
      alert("Account Created, proceed to login.");
    }

    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

formOpenBtn.addEventListener("click", () => home.classList.add("show"));
formCloseBtn.addEventListener("click", () => home.classList.remove("show"));

emailLogin.addEventListener("change", (e) => {
  emailInput = e.target.value;
  console.log(emailInput);
});

passwordLogin.addEventListener("change", (e) => {
  passwordInput = e.target.value;
  console.log(passwordInput);
});

emailSignup.addEventListener("change", (e) => {
  emailSignUpInput = e.target.value;
  console.log(emailSignUpInput);
});

phoneSignup.addEventListener("change", (e) => {
  phoneInput = e.target.value;
  console.log(phoneInput);
});

firstNameSignup.addEventListener("change", (e) => {
  firstNameInput = e.target.value;
  console.log(firstNameInput);
});

lastNameSignup.addEventListener("change", (e) => {
  lastNameInput = e.target.value;
  console.log(lastNameInput);
});

passwordSignUp.addEventListener("change", (e) => {
  passwordSignUpInput = e.target.value;
  console.log(passwordSignUpInput);
});

confirmPasswordSignUp.addEventListener("change", (e) => {
  confirmPasswordInput = e.target.value;
  console.log(confirmPasswordInput);
});

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
  formContainer.classList.remove("active");
});

signup_btn.addEventListener("click", (e) => {
  e.preventDefault();
  signUpAuth();
  formContainer.classList.remove("active");
  formOpenBtn.addEventListener("click", () => home.classList.add("show"));
});

login_btn.addEventListener("click", (event) => {
  event.preventDefault();
  console.log(emailInput, passwordInput);
  loginAuth();
});
