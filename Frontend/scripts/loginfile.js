document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const url = `http://18.117.225.244/v1/auth/signin`;
    const emailLogin = document.getElementById("emailLogin").value;
    const passwordLogin = document.getElementById("passwordLogin").value;

    const payload = {
      email: emailLogin,
      password: passwordLogin,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      sessionStorage.setItem("authDetails", JSON.stringify(data));
      window.location.href = "../../Frontend/pages/sidebar.html";
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  });
