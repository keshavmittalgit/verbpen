import React from "react";
import { createRoot } from "react-dom/client";
import '../assets/styles.scss';
import ContentScript from "./contentScript";

function init() {
    const appContainer = document.createElement('div');
    if (!appContainer) {
        throw new Error("Can not find appContainer");
    }

    document.body.appendChild(appContainer);
    const root = createRoot(appContainer);
    console.log(appContainer);
    root.render(<div id='verbpen'><ContentScript/></div>);
}

init();
