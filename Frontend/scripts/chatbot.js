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
let isChatbotMinimized = false;

function toggleChatbot() {
  const popup = document.getElementById("chatbot-popup");
  
  if (isChatbotMinimized) {
    popup.style.display = "flex";
    isChatbotMinimized = false;
  } else if (popup.style.display === "flex") {
    // Minimize the chatbot instead of closing it
    popup.style.display = "none";
    isChatbotMinimized = true;
  } else {
    popup.style.display = "flex";
    setIframeToken(); // This keeps the session active without restarting the prompt
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
  
  iframe.src = url;
}
