import type { Metadata } from "next";

import ResetPassword from "@/components/pages/reset-password";

export const metadata: Metadata = {
  title: "Redefinir senha",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  return <ResetPassword token={token ?? ""} />;
}
