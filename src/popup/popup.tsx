import React from "react";
// import Button from '@material-ui/core/Button';
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/login-form"

import './popup.css'

const Popup = () => {
    return (
        <div className="flex justify-center items-center w-full h-[100vh] bg-black class">
            <LoginForm className="dark" />
        </div>
    )
};

export default Popup;