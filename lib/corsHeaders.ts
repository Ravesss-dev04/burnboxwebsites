// lib/corsHeaders.ts

const allowedOrigin =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000" //  Allow local testing
    : "https://aliceblue-crocodile-988630.hostingersite.com"; //  Your Hostinger frontend URL

export const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};
