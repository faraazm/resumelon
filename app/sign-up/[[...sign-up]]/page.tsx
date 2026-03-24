import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4" style={{ colorScheme: "light" }}>
      <SignUp
        appearance={{
          variables: {
            colorBackground: "#ffffff",
            colorText: "#000000",
            colorTextSecondary: "#6b7280",
          },
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg bg-white",
            headerTitle: "text-black",
            headerSubtitle: "text-gray-600",
            formFieldLabel: "text-gray-700",
            footerActionText: "text-gray-600",
            footerActionLink: "text-black",
          },
        }}
        forceRedirectUrl="/onboarding"
        signInUrl="/sign-in"
      />
    </div>
  );
}
