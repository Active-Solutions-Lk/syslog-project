"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { useState } from "react";

export default function LoginPage() {
  const [session, setSession] = useState(null);

  console.log("session data", session);
  return (
    <AuthLayout
      title="Login"
      welcomeHeading="Hello, Welcome!"
      welcomeSubheading="Log in now to manage your device logs more efficiently and stay in full control!"
      sidePosition="left"
    >
      <LoginForm setSession={setSession} />
    </AuthLayout>
  );
}