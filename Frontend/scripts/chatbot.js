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

// function minimizeChatbot() {
//   const popup = document.getElementById("chatbot-popup");
//   popup.classList.toggle("minimized");
//   isMaximized = false; 
// }

function toggleChatbot() {
  const popup = document.getElementById("chatbot-popup");
  const chatIcon = document.getElementById("chat-icon");

  if (popup.style.display === "none" || popup.style.display === "") {
    popup.style.display = "flex";
    chatIcon.style.display = "none"; 
    setIframeToken();
  } else {
    popup.style.display = "none";
    chatIcon.style.display = "block"; 
  }
}

function setIframeToken() {
  const fullUserDetails = JSON.parse(sessionStorage.getItem("authDetails"));
  const accessToken = fullUserDetails?.token?.access_token;
  const refreshToken = fullUserDetails?.token?.refresh_token;

  if (accessToken && refreshToken) {
    const token = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };

    const tokenString = encodeURIComponent(JSON.stringify(token));
    const url = `http://54.146.243.168:8501?token=${tokenString}`;

    const iframe = document.getElementById("chatbot-frame");
    iframe.src = url;
  } else {
    console.error("Token not found in session storage.");
  }
}
