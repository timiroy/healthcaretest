let isMaximized = false;

async function fetchIPAddress() {
        // Request metadata token
        const tokenResponse = await fetch('http://169.254.169.254/latest/api/token', {
            method: 'PUT',
            headers: {
                'X-aws-ec2-metadata-token-ttl-seconds': '3600'
            }
        });
        const token = await tokenResponse.text();

        // Request public IPv4 address
        const ipResponse = await fetch('http://169.254.169.254/latest/meta-data/public-ipv4', {
            headers: {
                'X-aws-ec2-metadata-token': token
            }
        });
        const ip = await ipResponse.text();

        // Update iframe src with the fetched IP address
        const iframe = document.getElementById('chatbot-frame');
        iframe.src = `http://${ip}:8501`;  // Assuming the port is 8501
      }

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
}

window.onload = fetchIPAddress;