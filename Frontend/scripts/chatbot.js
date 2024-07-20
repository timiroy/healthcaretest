
function toggleChatbot() {
  const chatbotPopup = document.getElementById('chatbot-popup');
  const isVisible = chatbotPopup.style.display === 'flex';

  if (isVisible) {
      chatbotPopup.style.display = 'none';
  } else {
      chatbotPopup.style.display = 'flex';
  }
}
function toggleMaximize() {
  var popup = document.getElementById('chatbot-popup');
  popup.classList.toggle('maximized');
}