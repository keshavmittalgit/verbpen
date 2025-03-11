// FloatingBox.tsx
import React, { useState, useEffect, useRef } from "react";
// import "./content.css";
import "../assets/styles.scss";

const FloatingBox: React.FC = () => {
  const [capturedText, setCapturedText] = useState("Captured text will appear here");
  const lastActiveElement = useRef<HTMLElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  // For dragging
  const isDragging = useRef(false);
  const offsetX = useRef(0);
  const offsetY = useRef(0);

  function isValidTextInput(el: Element): boolean {
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

  function getEditableContainer(element: HTMLElement): HTMLElement | null {
    let el: HTMLElement | null = element;
    while (el && !el.isContentEditable) {
      el = el.parentElement;
    }
    return el;
  }

  function drillDownDiv(element: HTMLElement): HTMLElement {
    let el: HTMLElement = element;
    while (el.children && el.children.length > 0) {
      el = el.lastElementChild as HTMLElement;
    }
    return el;
  }

  // Directly update the target element's text content
  function changeTextFields() {
    if (!lastActiveElement.current) return;
    const newText = "Changed Text";

    if (
      lastActiveElement.current instanceof HTMLInputElement ||
      lastActiveElement.current instanceof HTMLTextAreaElement
    ) {
      lastActiveElement.current.value = newText;
    } else {
      const editable = getEditableContainer(lastActiveElement.current);
      if (!editable) return;
      const targetElement =
        editable.children.length === 0 ? editable : drillDownDiv(editable);
      targetElement.innerText = newText;
    }
    setCapturedText(newText);
  }

  // Capture events to update the active element and its text
  function handleCaptureEvent(event: Event) {
    setTimeout(() => {
      const target = event.target as HTMLElement;
      if (
        (target instanceof HTMLTextAreaElement && isValidTextInput(target)) ||
        (target instanceof HTMLInputElement && isValidTextInput(target))
      ) {
        lastActiveElement.current = target;
        setCapturedText(target.value);
      } else {
        const editableContainer = getEditableContainer(target);
        if (editableContainer) {
          lastActiveElement.current = editableContainer;
          setCapturedText(editableContainer.innerText);
        }
      }
    }, 10);
  }

  useEffect(() => {
    // Add event listeners for capturing text from inputs and contenteditable elements
    document.addEventListener("focusin", handleCaptureEvent, true);
    document.addEventListener("input", handleCaptureEvent, true);
    document.addEventListener("keyup", handleCaptureEvent, true);
    document.addEventListener("compositionend", handleCaptureEvent, true);

    // Drag listeners for the floating box
    const box = boxRef.current;
    if (!box) return;
    const onMouseDown = (e: MouseEvent) => {
      // Allow dragging only if clicking on the box (not on buttons)
      if (e.target === box || e.target === box.firstElementChild) {
        isDragging.current = true;
        const rect = box.getBoundingClientRect();
        offsetX.current = e.clientX - rect.left;
        offsetY.current = e.clientY - rect.top;
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current && box) {
        box.style.left = e.clientX - offsetX.current + "px";
        box.style.top = e.clientY - offsetY.current + "px";
      }
    };
    const onMouseUp = () => {
      isDragging.current = false;
    };

    box.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("focusin", handleCaptureEvent, true);
      document.removeEventListener("input", handleCaptureEvent, true);
      document.removeEventListener("keyup", handleCaptureEvent, true);
      document.removeEventListener("compositionend", handleCaptureEvent, true);

      box.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      className="verbpen-floating-box"
    >
      <div className="verbpen-text-capture">
        {capturedText || "Captured text will appear here"}
      </div>
      <button className="bg-gray-600 rounded-[5px] px-2 py-1 text-white" onClick={changeTextFields}>
        Replace
      </button>
    </div>
  );
};

export default FloatingBox;
