import { AuthSplit } from "@/components/auth/AuthSplit";
import { ClerkSignInBox } from "@/components/auth/ClerkAuthBox";
import { AuthFallback } from "@/components/auth/AuthFallback";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const isPlaceholderKey =
  !clerkKey || clerkKey === "pk_test_placeholder" || !clerkKey.startsWith("pk_");

export default function SignInPage() {
  return (
    <AuthSplit
      kicker="SE CONNECTER"
      title="Continuer la partie"
      subtitle="Choisis comment te connecter — c'est instantané."
    >
      {isPlaceholderKey ? <AuthFallback mode="sign-in" /> : <ClerkSignInBox />}
    </AuthSplit>
  );
}
