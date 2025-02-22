// background.ts
console.log("Background script running");

// background.ts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'roshni') {
      // Respond back to the content script
      sendResponse({ message: 'Received your message!' });
    }
  });
