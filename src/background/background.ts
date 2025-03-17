import { get } from "http";
import { CodeSquare } from "lucide-react";

console.log("Background script loaded");

const PROMPT = `Correct the spelling and grammar of the following sentences/text, 
    make the first first letter of the first word capital
    if the input is not raped in quotes then remove quotes and return the correct text else please keep the quotes,
    if the input is single word and it looks like passowrd or anythihng like just return the text,
    return the output text only nothing else here is the input : `;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "processData") {
    const tabId = sender.tab ? sender.tab.id : null;
    console.log("Received data from tab:", tabId, message.data);
    console.log(message.data.text);

    // Process the message asynchronously
    getGeminiResponse(PROMPT, message.data.text)
      .then((text) => {
        sendResponse({ text });
      })
      .catch((error) => {
        console.error("Error processing Gemini response:", error);
        sendResponse({ text: "" });
      });

    // Return true to indicate that we will send a response asynchronously.
    return true;
  }
  return false;
});

async function getGeminiResponse(prompt, text) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.API_KEY}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `${prompt} [${text}]`,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  } catch (error) {
    // console.error('Error:', error);
    return "";
  }
}

//testing if the API call is working or not
getGeminiResponse(PROMPT, "WHADHF").then((text) => {
  console.log(text);
});
