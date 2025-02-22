function extractData(): any {
  // Example: Extracting all text from <p> tags
  const paragraphs = document.querySelectorAll("p");
  const data = Array.from(paragraphs).map((p) => p.textContent);
  return data;

  
}

// Send the data to the background script.  Crucially, use chrome.runtime.sendMessage
chrome.runtime.sendMessage({ data: extractData() }, (response) => {
  // Optional: Handle a response from the background script.  This is useful for
  // bidirectional communication, or to confirm the data was received.
  if (chrome.runtime.lastError) {
    console.error("Error sending message:", chrome.runtime.lastError);
    return;
  }
  console.log("Background script responded:", response);
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractData") {
    const data = extractData();
    sendResponse({ data: data }); // Send the extracted data as a response
  }
  return true; // Keep the message channel open for asynchronous responses.  VERY IMPORTANT!
});
//kuch bhi