import { get } from "http";
import { CodeSquare } from "lucide-react";
import { auth, createUserWithEmailAndPassword } from '@/firebase/firebase';
import { signInWithPopup } from 'firebase/auth';
import { signInWithEmailAndPassword } from "firebase/auth";

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if this is a create account message
  if (message.type === "CREATE_ACCOUNT") {
    //console.log("Background script received CREATE_ACCOUNT request:", message.data);
    // Extract the form data
    const { email, password } = message.data; 
    // Validate data (simple validation example)
    if (!email || !password) {
      console.error("Missing required fields");
      sendResponse({ success: false, error: "Missing required fields" });
      return true; // Keep the message channel open for the async response
    }
    
    // Simulate processing delay
    setTimeout(() => {
      // Generate a mock user I
      
      // Log the "created" account
      console.log("Account created:", {
        email,
        password,
        createdAt: new Date().toISOString()
      });
      
      // Send success response
      sendResponse({
        success: true,
        message: "Account created successfully"
      });
    }, 1000);
    
    return true; // Keep the message channel open for the async response
  }
  
  // If it's not a message we recognize, don't handle it
  return false;
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "someOtherTask") {
    console.log("Received message in background.js");
    sendResponse({ success: true });
  }
  return true;
});