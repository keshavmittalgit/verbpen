
const sendButton = document.createElement('button');
sendButton.textContent = 'Send Message to Background';

// Style the button so it's visible and fixed on the page
sendButton.style.position = 'fixed';
sendButton.style.bottom = '20px';
sendButton.style.right = '20px';
sendButton.style.zIndex = '1000';

// Append the button to the document body
document.body.appendChild(sendButton);

// Add a click event listener to the button
sendButton.addEventListener('click', () => {
  // Send a message to the background script
  chrome.runtime.sendMessage({ message: 'roshni' }, (response) => {
    console.log("Background script responded:", response?.message);
  });
});


