import dotenv from "dotenv";
dotenv.config();

export const config = {
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  COOKIE_SECRET: process.env.COOKIE_SECRET || "cookie-secret-key",
  PORT: process.env.PORT || 3001,
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: "lax" as const,
  },
};
