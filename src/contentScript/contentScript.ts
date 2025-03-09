// content.js
import "./content.css";

console.log("Content script loaded");

let capturedText = "";
let lastActiveElement = null;

// Create the floating box
const floatingBox = document.createElement("div");
floatingBox.classList.add("floating-box");
// Basic styling to ensure it's on top
floatingBox.style.position = "fixed";
floatingBox.style.top = "10px";
floatingBox.style.left = "10px";
floatingBox.style.zIndex = "999999"; // High z-index

const textDisplay = document.createElement("div");
textDisplay.textContent = "Captured text will appear here";
floatingBox.appendChild(textDisplay);

function isValidTextInput(el) {
  if (el instanceof HTMLInputElement) {
    const type = el.type.toLowerCase();
    return (
      type !== "password" &&
      type !== "email" &&
      (type === "text" ||
        type === "search" ||
        type === "url" ||
        type === "tel" ||
        type === "number")
    );
  }
  return el instanceof HTMLTextAreaElement;
}

// Use the native value setter to ensure React/Angular/Google watchers fire
function setNativeValue(element, value) {
  const prototype = Object.getPrototypeOf(element);
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
  descriptor?.set?.call(element, value);
}

function getEditableContainer(element) {
  let el = element;
  while (el && !el.isContentEditable) {
    el = el.parentElement;
  }
  return el;
}

function drillDownDiv(element) {
  let el = element;
  while (el.children && el.children.length > 0) {
    el = el.lastElementChild;
  }
  return el;
}

function changeTextFields() {
  if (!lastActiveElement) return;

  const newText = "Changed Text";

  // If it's a valid <input> or <textarea>, set using the native setter
  if (
    (lastActiveElement instanceof HTMLTextAreaElement && isValidTextInput(lastActiveElement)) ||
    (lastActiveElement instanceof HTMLInputElement && isValidTextInput(lastActiveElement))
  ) {
    setNativeValue(lastActiveElement, newText);
    // Dispatch events so the page recognizes the change
    lastActiveElement.dispatchEvent(new Event("input", { bubbles: true }));
    lastActiveElement.dispatchEvent(new Event("change", { bubbles: true }));
  } else {
    // If it's a contenteditable container
    const editable = getEditableContainer(lastActiveElement);
    if (!editable) return;

    if (editable.children.length === 0) {
      editable.innerText = newText;
    } else {
      const deepestElement = drillDownDiv(editable);
      deepestElement.innerText = newText;
    }
    editable.dispatchEvent(new Event("input", { bubbles: true }));
    editable.dispatchEvent(new Event("change", { bubbles: true }));
  }

  textDisplay.textContent = newText;
}

function handleCaptureEvent(event) {
  // Delay to let the target update
  setTimeout(() => {
    const target = event.target;
    if (
      (target instanceof HTMLTextAreaElement && isValidTextInput(target)) ||
      (target instanceof HTMLInputElement && isValidTextInput(target))
    ) {
      lastActiveElement = target;
      capturedText = target.value;
    } else {
      const editableContainer = getEditableContainer(target);
      if (editableContainer) {
        lastActiveElement = editableContainer;
        capturedText = editableContainer.innerText;
      }
    }

    textDisplay.textContent = capturedText || "Captured text will appear here";
  }, 10);
}

// Create the Replace Text button
const button = document.createElement("button");
button.textContent = "Replace Text";
button.classList.add("replace-button");
button.addEventListener("click", changeTextFields);
floatingBox.appendChild(button);

// Create a toggle (minimize) button
const toggleButton = document.createElement("button");
toggleButton.textContent = "–";
toggleButton.classList.add("toggle-button");
toggleButton.addEventListener("click", () => {
  if (textDisplay.style.display === "none") {
    textDisplay.style.display = "block";
    button.style.display = "block";
    toggleButton.textContent = "–";
  } else {
    textDisplay.style.display = "none";
    button.style.display = "none";
    toggleButton.textContent = "+";
  }
});
floatingBox.appendChild(toggleButton);

// Draggable floating box
let isDragging = false;
let offsetX, offsetY;

floatingBox.addEventListener("mousedown", (e) => {
  // Only drag if clicked directly on the box (not on a button)
  if (e.target === floatingBox || e.target === textDisplay) {
    isDragging = true;
    offsetX = e.clientX - floatingBox.getBoundingClientRect().left;
    offsetY = e.clientY - floatingBox.getBoundingClientRect().top;
  }
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    floatingBox.style.left = e.clientX - offsetX + "px";
    floatingBox.style.top = e.clientY - offsetY + "px";
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

// Append the box after DOM is ready
if (document.body) {
  document.body.appendChild(floatingBox);
} else {
  document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(floatingBox);
  });
}

// Listen for focus and input events to capture text
document.addEventListener("focusin", handleCaptureEvent, true);
document.addEventListener("input", handleCaptureEvent, true);
document.addEventListener("keyup", handleCaptureEvent, true);
document.addEventListener("compositionend", handleCaptureEvent, true);
