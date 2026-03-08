import { Polar } from "@polar-sh/sdk";

type PolarServer = "sandbox" | "production";

const server =
  (process.env.POLAR_SERVER as PolarServer | undefined) ??
  (process.env.NODE_ENV === "production" ? "production" : "sandbox");

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server,
});
