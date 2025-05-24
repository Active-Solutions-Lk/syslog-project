"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Sign-Up"
      welcomeHeading="Hello, Welcome!"
      welcomeSubheading="Create your account today and start managing your device logs like a pro!"
      sidePosition="right"
    >
      <SignupForm />
    </AuthLayout>
  );
}