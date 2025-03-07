import { CodeSquare } from "lucide-react";

console.log('Background script loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'processData') {
    // The sender object contains tab information when sent from a content script
    const tabId = sender.tab ? sender.tab.id : null;
    console.log('Received data from tab:', tabId, message.data);
    console.log(message.data.text);
    // Process the message as needed
    // ...

    // Optionally send a response back to the sender
    sendResponse({ status: 'received' });
  }
  // Return true if you plan to send a response asynchronously.
  return false;
});

async function callAPI(inputText) {
  const apiKey = 'AIzaSyCHFUnmzmG4eB9-NUfFnhsUOqqc3AbhKhU'; // Use your provided API key.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{
        text: inputText
      }]
    }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example usage:
callAPI("Hello");
