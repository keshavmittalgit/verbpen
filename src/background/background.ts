chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'processData') {
    // The sender object contains tab information when sent from a content script
    const tabId = sender.tab ? sender.tab.id : null;
    console.log('Received data from tab:', tabId, message.data);
    
    // Process the message as needed
    // ...

    // Optionally send a response back to the sender
    sendResponse({ status: 'received' });
  }
  // Return true if you plan to send a response asynchronously.
  return false;
});