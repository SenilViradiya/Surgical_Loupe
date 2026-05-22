import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";

import DealerProfileForm from "@/components/forms/dealer-profile-form";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session) {
    // client will handle redirect via proxy or guard
    return <div>Please sign in</div>;
  }

  const dealer = await prisma.dealer.findUnique({
    where: { email: session.user.email as string },
  });

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">Complete your profile</h1>

      <p className="text-sm text-muted-foreground mb-6">
        Finish onboarding by completing your dealer profile.
      </p>

      <DealerProfileForm initialData={dealer} />
    </div>
  );
}
