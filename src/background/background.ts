// background.ts

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Check if the message is from a content script and contains data
  if (request.data && sender.tab) {
    console.log("Data received from tab:", sender.tab.id, sender.tab.url);
    console.log("Extracted data:", request.data);

    // Process the data here.  For example:
    // - Store it in chrome.storage
    // - Send it to a server
    // - Send it to a popup
    // - Log to console (as shown)

    // Optional: Send a response back to the content script.
    sendResponse({ message: "Data received successfully!" });
  }
  return true; // VERY IMPORTANT!  Indicates you will send a response asynchronously.
});

// Example:  Trigger data extraction from a popup or another part of the extension.
// This function can be called from a popup script, for example.
async function getDataFromContentScript(tabId: number): Promise<Response> {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { action: "getData" }, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      resolve(response as Response); //Type assertion here
    });
  });
}

// Example usage:
// chrome.action.onClicked.addListener(async (tab) => {
//   if (tab.id) {
//     const data = await extractDataFromTab(tab.id);
//     // Do something with 'data'
//   }
// });
