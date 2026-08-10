"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, CheckCircle2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponseCode, useAuth } from "@/hooks";
import LoadingIndicator from "../loadingIndicator";
import PasswordRecoveryShell from "./password-recovery-shell";

export default function ForgotPassword() {
  const { forgotPassword, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await forgotPassword(email.trim());

    if (result.code === ResponseCode.SUCCESS) {
      setSent(true);
      return;
    }

    toast.error(result.message || "Não foi possível solicitar a recuperação agora.");
  };

  return (
    <PasswordRecoveryShell
      eyebrow="Recuperação de senha"
      title={sent ? "Confira seu WhatsApp" : "Vamos recuperar seu acesso"}
      description={
        sent
          ? "Se o e-mail estiver cadastrado, enviamos as próximas instruções para o WhatsApp vinculado à conta."
          : "Informe o mesmo e-mail que você usa para entrar. O link seguro será enviado para o seu WhatsApp cadastrado."
      }
    >
      {sent ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <span className="mb-5 grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
            <CheckCircle2 className="size-6" aria-hidden="true" />
          </span>
          <h3 className="text-lg font-bold">Solicitação recebida</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            O link expira em 30 minutos. Caso não encontre a mensagem, confirme se informou o e-mail correto e tente novamente.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button type="button" size="lg" onClick={() => setSent(false)}>
              Tentar outro e-mail
            </Button>
            <Button variant="ghost" size="lg" render={<Link href="/" />}>
              Voltar para o login
            </Button>
          </div>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="recovery-email">
            E-mail da conta
            <Input
              id="recovery-email"
              type="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="h-12"
              required
              autoFocus
            />
          </label>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            <MessageCircle className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <p>Nunca enviaremos sua senha. Você receberá apenas um link temporário e de uso único.</p>
          </div>
          <Button type="submit" size="lg" className="h-12" disabled={loading || !email.trim()}>
            {loading ? <LoadingIndicator /> : "Enviar link pelo WhatsApp"}
          </Button>
          <Link href="/" className="mt-1 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar para o login
          </Link>
        </form>
      )}
    </PasswordRecoveryShell>
  );
}
