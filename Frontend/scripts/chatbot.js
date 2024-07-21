let isMaximized = false;

function toggleMaximize() {
    const popup = document.getElementById('chatbot-popup');
    if (isMaximized) {
        popup.classList.remove('maximized');
        isMaximized = false;
    } else {
        popup.classList.add('maximized');
        isMaximized = true;
    }
}

function toggleChatbot() {
    const popup = document.getElementById('chatbot-popup');
    popup.style.display = popup.style.display === 'none' ? 'flex' : 'none';

    if (popup.style.display === 'flex') {
        setIframeToken();  // Ensure iframe src is set when opening the popup
    }
}

function setIframeToken() {
    const token = {
        "access_token": ".eJwNys0OQzAAAOB3cSfUT-YoZZSVsNXUZbGStdXZEsuinn77zp8x6ZzfUyYqkSOyI6cUaEVL4zOIAjS_uxbmofVPDgOt7oCakXyJUh45lcjHst76Z72VMQN0n218YW4fR6C_NqrcHz4FRJxgrqYsEpVMXCwTUMVEYzmG1kGnwaLOnl3QddAc6-G7uIR_CMy6wqsANM3bAMfNnFbjBzL3NvE.VPxCqRGtVhq71YwjT7nMf2i6fEg",
        "refresh_token": ".eJwNysEOQzAYAOB3cZ9MscXRFPtFCRvDZYlqaMsmGZl6-u07fxpT0dCGlKc8gmIHI-HwgVduUw9OIOeq9CJH_yeDolJVaJQg3jwRwVALsInItmbKtgRTVO_ySO7UbLCLmkc-Jntv16jgsReN7OryVPgmEWAR7CsiOkcP_VXFc8uQocxv0ZFziJ7G4qyYSQ-CW39YsukyVpll19oPLM02qA.gcjhCsC6HmLZL1kNxdPSpRakwpY"
    };

    const tokenString = encodeURIComponent(JSON.stringify(token));
    const url = `http://3.80.24.215:8501?token=${tokenString}`;

    const iframe = document.getElementById('chatbot-frame');
    console.log("Setting iframe src to:", url);
    iframe.src = url;
}
