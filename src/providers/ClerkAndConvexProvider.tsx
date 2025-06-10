import { CLERK_PUBLISHABLE_KEY, CONVEX_URL } from "@/constants/env-variables";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { PropsWithChildren } from "react";

if (!CLERK_PUBLISHABLE_KEY)
  throw new Error(
    "Missing publishable key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env!"
  );

const convex = new ConvexReactClient(CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const ClerkAndConvexProvider = ({ children }: PropsWithChildren) => {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
          {children}
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
};
export default ClerkAndConvexProvider;
