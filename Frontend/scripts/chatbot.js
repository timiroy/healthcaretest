let isMaximized = false;

function fetchIPAddress() {
  // Create a new XMLHttpRequest object
  var xhr = new XMLHttpRequest();
  
  // Request metadata token
  xhr.open('PUT', 'http://169.254.169.254/latest/api/token', true);
  xhr.setRequestHeader('X-aws-ec2-metadata-token-ttl-seconds', '3600');
  
  xhr.onload = function() {
      if (xhr.status === 200) {
          var token = xhr.responseText;

          // Request public IPv4 address
          var xhrIp = new XMLHttpRequest();
          xhrIp.open('GET', 'http://169.254.169.254/latest/meta-data/public-ipv4', true);
          xhrIp.setRequestHeader('X-aws-ec2-metadata-token', token);

          xhrIp.onload = function() {
              if (xhrIp.status === 200) {
                  var ip = xhrIp.responseText;

                  // Update iframe src with the fetched IP address
                  var iframe = document.getElementById('chatbot-frame');
                  iframe.src = 'http://' + ip + ':8501';  // Assuming the port is 8501
              } else {
                  console.error('Failed to fetch IP address:', xhrIp.statusText);
              }
          };

          xhrIp.onerror = function() {
              console.error('Request failed');
          };

          xhrIp.send();
      } else {
          console.error('Failed to fetch token:', xhr.statusText);
      }
  };

  xhr.onerror = function() {
      console.error('Request failed');
  };

  xhr.send();
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