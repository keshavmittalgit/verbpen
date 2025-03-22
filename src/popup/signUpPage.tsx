import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sign } from "crypto";
import { Link } from "react-router-dom";





export default function Signup({
  className,
}: React.ComponentPropsWithoutRef<"div">) {

  
  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  // Check password against several regex requirements
  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ];
    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));

   
  };

  const strength = checkStrength(password);
  const strengthScore = useMemo(
    () => strength.filter((req) => req.met).length,
    [strength]
  );

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  const goToLogin = () => { navigate("/login") };
  // Check if the confirm password field matches the password
  const isPasswordMatch = password === confirmPassword;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate password meets all requirements.
    if (strengthScore < 4) {
      setSubmitError("Password does not meet all requirements.");
      return;
    }
    // Validate the password and confirm password match.
    if (!isPasswordMatch) {
      setSubmitError("Passwords do not match.");
      return;
    }
    setSubmitError("");
    // Proceed with submission (e.g. API call) if validations pass.
    console.log("Form submitted", { email, password });
  };

  return (
    <div className="flex justify-center items-center w-full  ">
      <div className={cn("flex flex-col gap-6 w-full", className)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your email and password to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="h-2"></div>
                    <div className="relative">
                      <Input
                        id="password"
                        className={`${
                          password.length != 0 && strengthScore < 4
                            ? "border-red-500 focus:border-primary"
                            : ""
                        } pe-2`}
                        placeholder="Password"
                        type={isVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setSubmitError("");
                        }}
                        aria-invalid={strengthScore < 4}
                        aria-describedby="password-requirements"
                        required
                        minLength={8}
                      />
                      <button
                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={
                          isVisible ? "Hide password" : "Show password"
                        }
                        aria-pressed={isVisible}
                        aria-controls="password"
                      >
                        {isVisible ? (
                          <EyeOff
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        ) : (
                          <Eye size={16} strokeWidth={2} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        className={`${
                          !isPasswordMatch ? "border-red-500" : ""
                        } mt-2`}
                        placeholder="Confirm Password"
                        type={isVisible ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setSubmitError("");
                        }}
                        aria-invalid={!isPasswordMatch}
                        aria-describedby="confirm-password-error"
                        required
                      />
                    </div>
                  </div>

                  {/* Password strength indicator */}
                  <div
                    className=" mt-1 h-[4px] w-full overflow-hidden rounded-full bg-border"
                    role="progressbar"
                    aria-valuenow={strengthScore}
                    aria-valuemin={0}
                    aria-valuemax={4}
                    aria-label="Password strength"
                  >
                    <div
                      className={`h-full ${getStrengthColor(
                        strengthScore
                      )} transition-all duration-500 ease-out`}
                      style={{ width: `${(strengthScore / 4) * 100}%` }}
                    ></div>
                  </div>

                  {/* Password strength description */}
                  {submitError ? (
                    <p
                      id="confirm-password-error"
                      className="text-sm font-medium text-red-500"
                    >
                      {submitError}
                    </p>
                  ) : (
                    <p
                      id="password-requirements"
                      className="mb-0 text-sm font-medium text-foreground"
                    >
                      {getStrengthText(strengthScore)}. Must contain:
                    </p>
                  )}

                  {/* Password requirements list */}
                  <ul
                    className="space-y-1.5 mb-2"
                    aria-label="Password requirements"
                  >
                    {strength.map((req, index) => (
                      <li key={index} className="flex items-center gap-2">
                        {req.met ? (
                          <Check
                            size={16}
                            className="text-emerald-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <X
                            size={16}
                            className="text-muted-foreground/80"
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className={`text-xs ${
                            req.met
                              ? "text-emerald-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {req.text}
                          <span className="sr-only">
                            {req.met
                              ? " - Requirement met"
                              : " - Requirement not met"}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Display submission errors */}
                  {/* {submitError && (
                    <p id="confirm-password-error" className="text-sm font-medium text-red-500">
                        {submitError}
                    </p>
                    )} */}
                </div>

                <div className="grid gap-3">
                  <Button type="submit" className="w-full">
                    Create account
                  </Button>
                  <Button type="button" variant="outline" className="w-full">
                    Sign up with Google
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                If you have an account?{" "}
               <Link to="/login" className="underline underline-offset-4">
                 Login
               </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}