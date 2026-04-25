import { AuthSplit } from "@/components/auth/AuthSplit";
import { ClerkSignUpBox } from "@/components/auth/ClerkAuthBox";
import { AuthFallback } from "@/components/auth/AuthFallback";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const isPlaceholderKey =
  !clerkKey || clerkKey === "pk_test_placeholder" || !clerkKey.startsWith("pk_");

export default function SignUpPage() {
  return (
    <AuthSplit
      kicker="REJOINDRE"
      title="Créer ton compte Bandi"
      subtitle="Trois minutes pour rejoindre ta première table."
    >
      {isPlaceholderKey ? <AuthFallback mode="sign-up" /> : <ClerkSignUpBox />}
    </AuthSplit>
  );
}
