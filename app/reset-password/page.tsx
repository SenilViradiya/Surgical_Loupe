import { Suspense } from "react";

import ResetPasswordForm from "./reset-password-form";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    token?: string;
    mode?: string;
  }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  return (
    <Suspense fallback={null}>
      <ResetPasswordForm
        token={params.token ?? ""}
        mode={params.mode}
      />
    </Suspense>
  );
}
