const { auth } = require("@/lib/auth");
const { toNextJsHandler } = require("better-auth/next-js");

export const { GET, POST, PUT, DELETE } = toNextJsHandler(auth.handler);