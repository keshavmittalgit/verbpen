// typingSimulator.js
export function simulatePhysicalTyping(text, speed = 50) {
    return new Promise((resolve) => {
      if (!document.activeElement || 
          (document.activeElement === document.body && 
           !document.activeElement.isContentEditable)) {
        console.error("No valid input element is focused");
        resolve(false);
        return;
      }
  
      const characters = text.split('');
      let i = 0;
  
      function typeNextCharacter() {
        if (i >= characters.length) {
          resolve(true);
          return;
        }
  
        const char = characters[i];
        
        const keydownEvent = new KeyboardEvent('keydown', {
          key: char,
          code: `Key${char.toUpperCase()}`,
          keyCode: char.charCodeAt(0),
          which: char.charCodeAt(0),
          bubbles: true,
          cancelable: true
        });
        
        const keypressEvent = new KeyboardEvent('keypress', {
          key: char,
          code: `Key${char.toUpperCase()}`,
          keyCode: char.charCodeAt(0),
          which: char.charCodeAt(0),
          bubbles: true,
          cancelable: true
        });
        
        const keyupEvent = new KeyboardEvent('keyup', {
          key: char,
          code: `Key${char.toUpperCase()}`,
          keyCode: char.charCodeAt(0),
          which: char.charCodeAt(0),
          bubbles: true,
          cancelable: true
        });
        
        const inputEvent = new InputEvent('input', {
          data: char,
          inputType: 'insertText',
          bubbles: true,
          cancelable: true
        });
  
        document.activeElement.dispatchEvent(keydownEvent);
        document.activeElement.dispatchEvent(keypressEvent);
        document.activeElement.dispatchEvent(inputEvent);
        document.activeElement.dispatchEvent(keyupEvent);
        
        i++;
        setTimeout(typeNextCharacter, speed);
      }
  
      typeNextCharacter();
    });
  }
  