import React from "react";
import { createRoot } from "react-dom/client";
import "../assets/styles.scss";
import ContentScript from "./contentScript";

function init() {
  // Prevent multiple injections
  if (document.getElementById("verbpen-container")) return;

  const appContainer = document.createElement("div");
  document.body.appendChild(appContainer);
  const root = createRoot(appContainer);
  root.render(
    <div id="verbpen">
      <ContentScript />
    </div>
  );

  // Ensure popup re-attaches if removed
  const observer = new MutationObserver(() => {
    if (!document.body.contains(appContainer)) {
      document.body.appendChild(appContainer);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

init();
