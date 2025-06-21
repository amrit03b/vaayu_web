import { createCivicAuthPlugin } from "@civic/auth/nextjs";

const nextConfig = {
  /* your existing config options here */
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID,
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  loginSuccessUrl: "/dashboard",
  logoutSuccessUrl: "/",
});

export default withCivicAuth(nextConfig);