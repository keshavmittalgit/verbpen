import React from "react";
// import Button from '@material-ui/core/Button';
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/popup/loginPage"
import  Signup  from "@/popup/signUpPage"

import './popup.css'

const Popup = () => {
    return (
        <div className="flex justify-center items-center w-full h-[100vh] bg-black class dark">
            {/* <LoginForm className="dark" /> */}
            <Signup />
        </div>
    )
};

export default Popup;