import type { CookieOptions } from "express";

const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

export const authCookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
};

export const clearAuthCookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
};
