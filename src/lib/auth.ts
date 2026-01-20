import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { Resend } from "resend" // your Resend instance
import * as schema from "@/db/schema"; // your drizzle schema
import nodemailer from "nodemailer";

const resend = new Resend(process.env.RESEND_API_KEY!);

// const transporter = nodemailer.createTransport({
//   service: "gmail", // Shortcut for Gmail's SMTP settings - see Well-Known Services
//   auth: {
//     type: "OAuth2",
//     user: "me@gmail.com",
//     clientId: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//   },
// });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // your gmail
    pass: process.env.GMAIL_APP_PASSWORD, // that 16-character code
  },
});

export const auth = betterAuth({
    emailAndPassword: { 
        enabled: true, 
        requireEmailVerification: false,
        async sendResetPassword({ user, url }) {
            await transporter.sendMail({
                from: '"Talk.AI" <kingpreetpatel@gmail.com>',
                to: user.email,
                subject: "Reset your password",
                html: `Click <a href="${url}">here</a> to reset your password.`,
            });
        },
    },
    emailVerification: {   
        enabled: true, 
        async sendVerificationEmail({ user, url }) {
            await transporter.sendMail({
                from: '"Talk.AI" <kingpreetpatel@gmail.com>',
                to: user.email,
                subject: "Reset your password",
                html: `Click <a href="${url}">here</a> to reset your password.`,
            });
        },
    },
    socialProviders: { 
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
         }, 
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
         },
    },
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: {...schema}
    }),
});