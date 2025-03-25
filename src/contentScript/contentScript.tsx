// import '../assets/tailwind.css'
import FloatingBox from "./FloatingBox";
import "../assets/styles.scss";

console.log("Content script loaded");
function contentScript() {
  return (
    <FloatingBox/>
  )
}

function createButton() {
  // Create container for the button
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'extension-button-container';
  buttonContainer.style.cssText = `
    position: fixed;
    z-index: 9999;
    bottom: 20px;    /* Changed from 'top: 20px' to 'bottom: 20px' */
    left: 20px;  
    touch-action: none;
    user-select: none;
   
  `;

  // Create the actual button
  const button = document.createElement('div');
  button.id = 'extension-button';
  button.style.cssText = `
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color:  #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-family: Arial, sans-serif;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s, transform 0.2s;
    border: 1px solid black;
  `;

  // Create the "V" letter icon
  const vIcon = document.createElement('div');
  vIcon.id = 'extension-v-icon';
  vIcon.textContent = 'V';

  vIcon.style.cssText = `
    font-size: 24px;
    transform: scale(1);
    transition: opacity 0.3s;
    color:black;  `;

  // Create tick mark (checkmark) icon (hidden initially)
  const tickIcon = document.createElement('div');
  tickIcon.id = 'extension-tick-icon';
  tickIcon.innerHTML = '✓';
  tickIcon.style.cssText = `
    font-size: 24px;
    opacity: 0;
    position: absolute;
    transition: opacity 0.3s;
  `;

  // Add icons to the button
  button.appendChild(vIcon);
  button.appendChild(tickIcon);
  
  // Add button to the container
  buttonContainer.appendChild(button);
  
  // Add hover effect
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.05)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
  });

  // Add click effect
  button.addEventListener('click', () => {
    // Toggle between normal and active states
    if (button.getAttribute('data-active') === 'true') {
      // Return to normal state
      button.style.backgroundColor = ' #FFFFFF';
      vIcon.style.opacity = '1';
      tickIcon.style.opacity = '0';
      button.setAttribute('data-active', 'false');
    } else {
      // Active state (green with tick)
      button.style.backgroundColor = '#48bb78';
      vIcon.style.opacity = '0';
      tickIcon.style.opacity = '1';
      button.setAttribute('data-active', 'true');
      
      // Optional: Add a short animation
      button.style.transform = 'scale(1.1)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 200);
    }
  });

  // Make the button draggable
  makeDraggable(buttonContainer);
  
  // Add the button to the page
  document.body.appendChild(buttonContainer);
  
  return buttonContainer;
}

// Function to make an element draggable
function makeDraggable(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  element.onmousedown = dragMouseDown;
  
  function dragMouseDown(e) {
    e.preventDefault();
    // Get the cursor position at startup
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // Call a function whenever the cursor moves
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    // Calculate the new cursor position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    // Set the element's new position, keeping it within viewport bounds
    const newTop = element.offsetTop - pos2;
    const newLeft = element.offsetLeft - pos1;
    
    // Check viewport boundaries
    const maxX = window.innerWidth - element.offsetWidth;
    const maxY = window.innerHeight - element.offsetHeight;
    
    element.style.top = `${Math.min(Math.max(0, newTop), maxY)}px`;
    element.style.left = `${Math.min(Math.max(0, newLeft), maxX)}px`;
  }

  function closeDragElement() {
    // Stop moving when mouse button is released
    document.onmouseup = null;
    document.onmousemove = null;
    
    // Save the position to chrome.storage
    //saveButtonPosition(element.style.top, element.style.left);
  }
}

// Save button position to Chrome storage



// Initialize the button
function init() {
  // Check if button already exists to avoid duplicates
  if (!document.getElementById('extension-button-container')) {
    const buttonContainer = createButton();
    //loadButtonPosition(buttonContainer);
  }
}

// Run initialization
init();


// Mouse move even
export default contentScript;

