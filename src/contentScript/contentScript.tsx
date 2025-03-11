// import '../assets/tailwind.css'
import FloatingBox from "./FloatingBox";
import "../assets/styles.scss";

console.log("Content script loaded");
function contentScript() {
  return (
    <FloatingBox/>
  )
}

export default contentScript;

