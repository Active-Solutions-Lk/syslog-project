"use server";

export async function signupUser(formData) {
  try {
    const response = await fetch(`/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      throw new Error("Unexpected server response format");
    }

    if (!response.ok) {
      let errorMessage = data.error || "Unable to create account";

      switch (response.status) {
        case 400:
          errorMessage = data.error || "Invalid input data provided";
          break;
        case 409:
          errorMessage = data.error || "A user with this email already exists";
          break;
        case 404:
          errorMessage = "API endpoint not found";
          break;
        case 405:
          errorMessage = "Method not allowed";
          break;
        case 500:
          errorMessage = "Server error occurred. Please try again later.";
          break;
        default:
          errorMessage = "An unexpected error occurred";
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status,
      };
    }

    return {
      success: true,
      message: data.message || "Welcome to Active Solutions!",
      data,
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
      status: null,
    };
  }
}