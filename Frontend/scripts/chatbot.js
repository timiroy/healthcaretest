let isMaximized = false;

function toggleMaximize() {
  const popup = document.getElementById("chatbot-popup");
  if (isMaximized) {
    popup.classList.remove("maximized");
    isMaximized = false;
  } else {
    popup.classList.add("maximized");
    isMaximized = true;
  }
}

function toggleChatbot() {
  const popup = document.getElementById("chatbot-popup");
  popup.style.display = popup.style.display === "none" ? "flex" : "none";

  if (popup.style.display === "flex") {
    setIframeToken(); // Ensure iframe src is set when opening the popup
  }
}

function setIframeToken() {
  const fullUserDetails = JSON.parse(sessionStorage.getItem("authDetails"));
  const access_token = fullUserDetails?.token.access_token;
  const refresh_token = fullUserDetails?.token.refresh_token;

  const token = {
    access_token,
    refresh_token,
  };

  const tokenString = encodeURIComponent(JSON.stringify(token));
  const url = `http://54.146.243.168:8501?token=${tokenString}`;

  const iframe = document.getElementById("chatbot-frame");
  console.log("Setting iframe src to:", url);
  iframe.src = url;
}
