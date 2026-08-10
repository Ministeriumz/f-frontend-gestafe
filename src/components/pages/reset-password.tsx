"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Check, CheckCircle2, Circle, Eye, EyeOff, KeyRound, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponseCode, useAuth } from "@/hooks";
import LoadingIndicator from "../loadingIndicator";
import PasswordRecoveryShell from "./password-recovery-shell";

type ResetPasswordProps = {
  token: string;
};

type TokenStatus = "validating" | "valid" | "invalid" | "success";

export default function ResetPassword({ token }: ResetPasswordProps) {
  const { loading, resetPassword, validateResetToken } = useAuth();
  const [status, setStatus] = useState<TokenStatus>("validating");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const rules = useMemo(() => [
    { label: "8 caracteres ou mais", valid: password.length >= 8 },
    { label: "Uma letra maiúscula", valid: /[A-Z]/.test(password) },
    { label: "Um número", valid: /\d/.test(password) },
    { label: "Um caractere especial", valid: /[^\p{L}\p{N}\s]/u.test(password) },
  ], [password]);

  const passwordIsValid = rules.every((rule) => rule.valid);
  const passwordsMatch = confirmation.length > 0 && password === confirmation;

  useEffect(() => {
    let active = true;

    const validate = async () => {
      if (!token) {
        setStatus("invalid");
        return;
      }

      const result = await validateResetToken(token);
      if (active) {
        setStatus(result.code === ResponseCode.SUCCESS ? "valid" : "invalid");
      }
    };

    void validate();
    return () => {
      active = false;
    };
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!passwordIsValid || !passwordsMatch) {
      toast.error("Confira os requisitos e a confirmação da senha.");
      return;
    }

    const result = await resetPassword({
      token,
      novaSenha: password,
      confirmacaoSenha: confirmation,
    });

    if (result.code === ResponseCode.SUCCESS) {
      window.history.replaceState({}, "", "/redefinir-senha");
      setStatus("success");
      return;
    }

    if (result.code === ResponseCode.INVALID) {
      setStatus("invalid");
    }
    toast.error(result.message || "Não foi possível redefinir a senha.");
  };

  return (
    <PasswordRecoveryShell
      eyebrow="Nova credencial"
      title={status === "success" ? "Senha alterada" : "Crie sua nova senha"}
      description={
        status === "success"
          ? "Tudo certo. Sua conta já está protegida com a nova senha."
          : "Escolha uma senha forte e diferente da anterior. Você precisará digitá-la duas vezes."
      }
    >
      {status === "validating" && (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-border bg-muted/30 text-center">
          <LoadingIndicator />
          <p className="mt-4 text-sm font-semibold">Verificando a segurança do link...</p>
        </div>
      )}

      {status === "invalid" && (
        <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-6">
          <span className="mb-5 grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
            <XCircle className="size-6" aria-hidden="true" />
          </span>
          <h3 className="text-lg font-bold">Link inválido ou expirado</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Por segurança, cada link só pode ser usado uma vez e expira após 30 minutos. Solicite um novo para continuar.
          </p>
          <Button className="mt-6 h-12 w-full" size="lg" render={<Link href="/esqueci-senha" />}>
            Solicitar um novo link
          </Button>
        </div>
      )}

      {status === "success" && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <span className="mb-5 grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
            <CheckCircle2 className="size-6" aria-hidden="true" />
          </span>
          <h3 className="text-lg font-bold">Acesso recuperado com sucesso</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            O link utilizado foi invalidado. Agora você já pode entrar com sua nova senha.
          </p>
          <Button className="mt-6 h-12 w-full" size="lg" render={<Link href="/" />}>
            Ir para o login
          </Button>
        </div>
      )}

      {status === "valid" && (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="new-password">
            Nova senha
            <span className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                className="h-12 pr-12"
                maxLength={255}
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted-foreground transition-colors hover:text-primary"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </span>
          </label>

          <div className="grid grid-cols-1 gap-2 rounded-xl border border-border bg-muted/35 p-4 sm:grid-cols-2">
            {rules.map((rule) => (
              <div key={rule.label} className={`flex items-center gap-2 text-xs font-medium ${rule.valid ? "text-primary" : "text-muted-foreground"}`}>
                {rule.valid ? <Check className="size-4" aria-hidden="true" /> : <Circle className="size-3.5" aria-hidden="true" />}
                {rule.label}
              </div>
            ))}
          </div>

          <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="confirm-password">
            Confirme a nova senha
            <span className="relative">
              <Input
                id="confirm-password"
                type={showConfirmation ? "text" : "password"}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                autoComplete="new-password"
                className="h-12 pr-12"
                maxLength={255}
                aria-invalid={confirmation.length > 0 && !passwordsMatch}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmation((current) => !current)}
                className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted-foreground transition-colors hover:text-primary"
                aria-label={showConfirmation ? "Ocultar confirmação" : "Mostrar confirmação"}
              >
                {showConfirmation ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </span>
            {confirmation.length > 0 && (
              <span className={`flex items-center gap-1.5 text-xs ${passwordsMatch ? "text-primary" : "text-destructive"}`}>
                {passwordsMatch ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
                {passwordsMatch ? "As senhas coincidem" : "As senhas não coincidem"}
              </span>
            )}
          </label>

          <Button type="submit" size="lg" className="h-12" disabled={loading || !passwordIsValid || !passwordsMatch}>
            {loading ? <LoadingIndicator /> : <><KeyRound className="size-4" /> Salvar nova senha</>}
          </Button>
        </form>
      )}
    </PasswordRecoveryShell>
  );
}
