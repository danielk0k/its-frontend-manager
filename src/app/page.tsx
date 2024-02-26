<!-- import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1>Welcome to ITS</h1>
        <div>
          <a href="/register">
            <button>Register</button>
          </a>
        </div>
        <div>
          <a href="/api/auth/signin">
            <button>Sign In</button>
          </a>
        </div> -->
"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoginForm }  from "./auth/LoginForm";
import { RegisterForm } from "./auth/RegisterForm";

export default function Page() {
  const [showLoginForm, setShowLoginForm] = useState(true);

  const handleRegisterClick = () => {
    setShowLoginForm(!showLoginForm);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: "70%"}}>
        {/* to add image */}
      </div>
      <div style={{ flex: "30%", backgroundColor: "#ccc", padding: "20px" }}>
        {showLoginForm ? (
          <>
          <LoginForm /> 
          <div style={{ justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
            <div style={{ display: 'flex' }}>
              <p style={{ color: 'gray' }}> Don't have an account? </p>
            </div>
            <div>
              <Button variant="link" onClick={handleRegisterClick}>Register now</Button>
            </div>
          </div> 
          </>)
        : (
          <><RegisterForm />
            <div style={{ justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
              <div style={{ display: 'flex' }}>
                <p style={{ color: 'gray' }}> Have an account? </p>
              </div>
              <div>
                <Button variant="link" onClick={handleRegisterClick}>Login now</Button>
            </div> 
          </>)
        }
      </div>
    </div>
  );
}
