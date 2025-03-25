import React from "react";
// import Button from '@material-ui/core/Button';
import ReactDOM from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/popup/loginPage"
import  Signup  from "@/popup/signUpPage"
import { useNavigate } from "react-router-dom";
//import LoginForm from "./LoginForm";


import './popup.css'

const Popup = () => {
    return (
        <MemoryRouter>
      <div className="flex justify-center items-center w-full h-[100%] bg-black dark">
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </div>
     
      
     </MemoryRouter>
        
    )
};




  

export default Popup;