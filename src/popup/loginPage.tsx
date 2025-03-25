import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {app} from "@/firebase/firebase"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import React, { useState } from "react"
import { auth, googleProvider } from '@/firebase/firebase';
import { signInWithPopup } from 'firebase/auth';



import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"





export function LoginForm({
  className
}: React.ComponentPropsWithoutRef<"div">) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    console.log("Updated Email:", e.target.value); // Debugging log
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    console.log("Updated Password:", e.target.value); // Debugging log
  };
  const handleLogin =async (event: React.FormEvent) => {
    event.preventDefault();
    //console.log("Sending login details:", { email, password });
    // Send data to background script
    chrome.runtime.sendMessage({ action: "loginWithEmail", email, password }, (response) => {
      console.log("Response from background:", response);
    });
  };
  
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={handleEmailChange}
                
                  
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required onChange={handlePasswordChange}  />
              </div>
              <Button type="submit" className="w-full"  >
                Login
              </Button>
              <Button variant="outline" className="w-full" >
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/" className="underline underline-offset-4">
              Signup
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

//export default LoginForm; 2                                  
