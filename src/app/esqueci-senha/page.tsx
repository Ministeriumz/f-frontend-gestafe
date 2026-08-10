import type { Metadata } from "next";

import ForgotPassword from "@/components/pages/forgot-password";

export const metadata: Metadata = {
  title: "Esqueci minha senha",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
