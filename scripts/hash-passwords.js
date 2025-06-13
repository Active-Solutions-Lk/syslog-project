// scripts/hash-passwords.js
import  authPrisma  from "../lib/auth-prisma";
import * as argon2 from "argon2";

async function hashExistingPasswords() {
  try {
    const users = await authPrisma.user.findMany();
    for (const user of users) {
      if (user.password && !user.password.startsWith("$argon2")) {
        // Check if password is not already hashed
        const hashedPassword = await argon2.hash(user.password);
        await authPrisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        });
        console.log(`Hashed password for user: ${user.email}`);
      }
    }
    console.log("Password hashing complete");
  } catch (error) {
    console.error("Error hashing passwords:", error);
  }
}

hashExistingPasswords().then(() => process.exit(0));