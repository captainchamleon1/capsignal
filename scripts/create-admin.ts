import "dotenv/config";
import { auth } from "../src/lib/auth";
import { db } from "../src/lib/db";

const email = process.argv[2] ?? process.env.ADMIN_EMAIL;
const password = process.argv[3] ?? process.env.ADMIN_PASSWORD;
const name = process.argv[4] ?? process.env.ADMIN_NAME ?? "CapSignal Admin";

if (!email || !password) {
  console.error("Usage: npm run admin:create -- <email> <password> [name]");
  console.error("Or set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local");
  process.exit(1);
}

if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

async function main() {
  const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    console.log(`User already exists: ${email}`);
    console.log("Sign in at /login?next=/admin");
    return;
  }

  try {
    await auth.api.signUpEmail({
      body: {
        email: email.toLowerCase(),
        password,
        name,
      },
    });
  } catch (err) {
    console.error("Failed to create admin:", err instanceof Error ? err.message : err);
    process.exit(1);
  }

  console.log(`Admin user created: ${email}`);
  console.log("Add this email to ADMIN_EMAILS in Vercel if not already listed.");
  console.log("Sign in at /login?next=/admin");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
