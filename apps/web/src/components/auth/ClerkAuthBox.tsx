"use client";

import { SignIn, SignUp } from "@clerk/nextjs";

const APPEARANCE = {
  elements: {
    rootBox: { width: "100%" },
    card: {
      background: "transparent",
      boxShadow: "none",
      padding: 0,
      width: "100%",
    },
    headerTitle: { display: "none" },
    headerSubtitle: { display: "none" },
    socialButtonsBlockButton: {
      background: "var(--cream)",
      color: "#1A1A1A",
      border: "none",
      borderRadius: 10,
      fontFamily: "var(--font-body)",
      fontSize: 14,
      fontWeight: 600,
      padding: "13px 16px",
    },
    socialButtonsBlockButtonText: {
      fontFamily: "var(--font-body)",
      fontWeight: 600,
    },
    dividerLine: { background: "rgba(201,168,118,0.18)" },
    dividerText: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "0.2em",
      color: "rgba(245,242,237,0.5)",
    },
    formFieldLabel: {
      fontFamily: "var(--font-body)",
      fontSize: 12,
      color: "rgba(245,242,237,0.65)",
      letterSpacing: "0.05em",
    },
    formFieldInput: {
      background: "rgba(46,61,77,0.4)",
      border: "1px solid rgba(201,168,118,0.18)",
      color: "var(--cream)",
      borderRadius: 10,
      fontFamily: "var(--font-body)",
      fontSize: 14,
      padding: "12px 14px",
    },
    formButtonPrimary: {
      background: "linear-gradient(180deg, #C95048, #8E2F2A)",
      color: "var(--cream)",
      borderRadius: 99,
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      fontSize: 14,
      padding: "13px 24px",
      boxShadow: "0 4px 14px rgba(180,68,62,0.4)",
      textTransform: "none",
    },
    footerActionText: {
      fontFamily: "var(--font-body)",
      fontSize: 13,
      color: "rgba(245,242,237,0.6)",
    },
    footerActionLink: {
      fontFamily: "var(--font-body)",
      color: "var(--or-2)",
      fontWeight: 600,
    },
    identityPreviewText: {
      color: "var(--cream)",
      fontFamily: "var(--font-body)",
    },
    formFieldErrorText: {
      color: "var(--terre-2)",
      fontFamily: "var(--font-body)",
      fontSize: 12,
    },
  },
} as const;

export function ClerkSignInBox() {
  return <SignIn appearance={APPEARANCE} />;
}

export function ClerkSignUpBox() {
  return <SignUp appearance={APPEARANCE} />;
}
