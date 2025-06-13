// app/api/auth/login/route.js
import { auth } from "../../../../lib/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // console.log("Login request received:", {
    //   method: request.method,
      
    //   url: request.url,
    //   headers: Object.fromEntries(request.headers),
    // });

    let body;
    try {
      body = await request.json();
      // console.log("Parsed request body:", body);
      console.log('Login request body:', body); // Log the body
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { email, password, rememberMe = false } = body;

    if (!email || !password) {
      console.log("Missing required fields:", { email, password });
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format:", email);
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Log attempt before calling better-auth
    // console.log("Attempting sign-in with:", { email, rememberMe });

    const result = await auth.api.signInEmail({
      email,
      password,
      rememberMe,
    });

    if (!result.success) {
      // console.log("Sign-in failed:", result);
      return NextResponse.json(
        { error: result.error || "Invalid credentials" },
        { status: 401 }
      );
    }

    // console.log("Sign-in successful:", result);
    return NextResponse.json({
      message: "Login successful",
      session: result.session,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}