// app/api/auth/signup/route.js
import { auth } from "../../../../lib/auth";
import { NextResponse } from "next/server";
import * as argon2 from "argon2";

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    // Hash the password using argon2
    const hashedPassword = await argon2.hash(password);

    // Create a new user using better-auth
    const user = await auth.api.signUp({
      email,
      password: hashedPassword, // Pass the hashed password
      name,
    });

    if (!user) {
      return NextResponse.json(
        { error: "User already exists or invalid data" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Sign-up error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}