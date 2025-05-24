"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Login"
      welcomeHeading="Hello, Welcome!"
      welcomeSubheading="Log in now to manage your device logs more efficiently and stay in full control!"
      sidePosition="left"
    >
      <LoginForm />
    </AuthLayout>
  );
}