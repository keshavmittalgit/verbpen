// Create and style a floating div to display captured text and include a Clear button
import './content.css';




console.log('Content script loaded');


let capturedText = '';

const floatingBox = document.createElement('div');
floatingBox.classList.add('floating-box');


// Create a container for text display
const textDisplay = document.createElement('div');
textDisplay.textContent = 'Captured text will appear here';
floatingBox.appendChild(textDisplay);

// Create a "Clear" button to delete/clear the content
const clearButton = document.createElement('button');
clearButton.textContent = 'Clear';
clearButton.classList.add('clear-button');


clearButton.addEventListener('click', () => {
  // Attempt to clear the content of the active element
  if(capturedText){
    chrome.runtime.sendMessage({ action: 'processData', data: { text: capturedText } });
  }
  const activeEl = document.activeElement;
  if (activeEl) {
    if (activeEl instanceof HTMLTextAreaElement) {
      activeEl.value = '';
    } else if (activeEl instanceof HTMLInputElement && isValidTextInput(activeEl)) {
      activeEl.value = '';
    } else {
      // For contenteditable elements, find the closest container and clear it
      const editable = getEditableContainer(activeEl);
      if (editable) {
        editable.innerText = '';
      }
    }
  }
  updateCapturedText('');

});
floatingBox.appendChild(clearButton);

// Append the floating box to the document
document.body.appendChild(floatingBox);

/**
 * Checks if an input element is valid for capturing text,
 * excluding types like "password" and "email".
 */
function isValidTextInput(el) {
  if (el instanceof HTMLInputElement) {
    const type = el.type.toLowerCase();
    return type !== 'password' && type !== 'email' && (
      type === 'text' ||
      type === 'search' ||
      type === 'url' ||
      type === 'tel' ||
      type === 'number'
    );
  }
  return false;
}

/**
 * Traverses up the DOM tree to find the closest contenteditable container.
 */
function getEditableContainer(element) {
  let el = element;
  while (el && !el.isContentEditable) {
    el = el.parentElement;
  }
  return el;
}

/**
 * Updates the text displayed in the floating box.
 */
function updateCapturedText(text) {
  textDisplay.textContent = text || 'Captured text will appear here';
  
}

/**
 * Handles capturing text from the event target.
 * A small delay is added to allow any internal updates (such as Gmail's) to complete.
 */
function handleCaptureEvent(event) {
  setTimeout(() => {
    let target = event.target;
    
  
    if (target instanceof HTMLTextAreaElement) {
      capturedText = target.value;
    } else if (target instanceof HTMLInputElement && isValidTextInput(target)) {
      capturedText = target.value;
    } else {
      const editableContainer = getEditableContainer(target);
      if (editableContainer) {
        capturedText = editableContainer.innerText;
      }
    }
    updateCapturedText(capturedText);
  }, 0);
}

// Listen for various events to capture text changes
document.addEventListener('focusin', handleCaptureEvent, true);
document.addEventListener('input', handleCaptureEvent, true);
document.addEventListener('keyup', handleCaptureEvent, true);
document.addEventListener('compositionend', handleCaptureEvent, true);

