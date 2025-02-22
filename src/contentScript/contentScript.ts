// Create and style a floating div to display captured text and include a Clear button
const floatingBox = document.createElement('div');
floatingBox.style.position = 'fixed';
floatingBox.style.top = '100px';
floatingBox.style.right = '100px';
floatingBox.style.padding = '10px';
floatingBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
floatingBox.style.color = '#fff';
floatingBox.style.borderRadius = '4px';
floatingBox.style.zIndex = '10000';
floatingBox.style.display = 'flex';
floatingBox.style.flexDirection = 'column';
floatingBox.style.gap = '10px';

// Create a container for text display
const textDisplay = document.createElement('div');
textDisplay.textContent = 'Captured text will appear here';
floatingBox.appendChild(textDisplay);

// Create a "Clear" button to delete/clear the content
const clearButton = document.createElement('button');
clearButton.textContent = 'Clear';
clearButton.style.padding = '5px';
clearButton.style.border = 'none';
clearButton.style.borderRadius = '4px';
clearButton.style.cursor = 'pointer';
clearButton.addEventListener('click', () => {
  // Attempt to clear the content of the active element
  const activeEl = document.activeElement as HTMLElement;
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
function isValidTextInput(el: Element): boolean {
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
function getEditableContainer(element: HTMLElement): HTMLElement | null {
  let el: HTMLElement | null = element;
  while (el && !el.isContentEditable) {
    el = el.parentElement;
  }
  return el;
}

/**
 * Updates the text displayed in the floating box.
 */
function updateCapturedText(text: string) {
  textDisplay.textContent = text || 'Captured text will appear here';
}

/**
 * Handles capturing text from the event target.
 */
function handleCaptureEvent(event: Event) {
  let target = event.target as HTMLElement;
  let capturedText = '';

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
}

// Listen for focus events (when you click into an input) and input events to capture changes.
// Using the capture phase to catch events from nested elements.
document.addEventListener('focusin', handleCaptureEvent, true);
document.addEventListener('input', handleCaptureEvent, true);
