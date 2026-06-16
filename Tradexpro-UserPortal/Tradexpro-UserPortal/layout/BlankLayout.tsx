import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
export default function BlankLayout({ children }: any) {
  return (
    <GoogleOAuthProvider
      clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}
    >
      {children}
    </GoogleOAuthProvider>
  );
}
