import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

type PasswordRecoveryShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function PasswordRecoveryShell({
  eyebrow,
  title,
  description,
  children,
}: PasswordRecoveryShellProps) {
  return (
    <main className="flex min-h-screen w-full bg-background text-foreground">
      <section className="bg-gradient relative hidden min-h-screen flex-1 overflow-hidden rounded-r-2xl px-16 py-14 xl:flex xl:max-w-[60%] xl:flex-col">
        <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full border border-white/15" />
        <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full border border-white/15" />

        <div className="relative z-10 flex items-center gap-3 text-subtle">
          <span className="grid size-11 place-items-center rounded-2xl bg-white/15 shadow-sm backdrop-blur-sm">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">Acesso seguro</p>
            <strong className="font-[Faculty_Glyphic] text-xl">GestaFé</strong>
          </div>
        </div>

        <div className="relative z-10 my-auto max-w-2xl text-subtle">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] opacity-70">{eyebrow}</p>
          <h1 className="font-[Faculty_Glyphic] text-5xl leading-[1.08] 2xl:text-7xl">
            Sua comunidade continua em movimento.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed opacity-80">
            Recupere seu acesso com segurança e volte a cuidar do que realmente importa.
          </p>
        </div>

        <p className="relative z-10 text-sm text-subtle/60">Ministerium · Tecnologia que aproxima</p>
      </section>

      <section className="flex min-h-screen w-full flex-col px-6 py-8 sm:px-10 xl:max-w-[40%]">
        <div className="flex justify-center xl:justify-end">
          <Image src="/gestafepreto.png" width={86} height={86} alt="GestaFé" className="opacity-30" priority />
        </div>

        <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col justify-center py-10">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
          <h2 className="font-[Faculty_Glyphic] text-4xl leading-tight text-foreground sm:text-5xl">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
        </div>

        <p className="text-center text-xs text-muted-foreground/70">Feito pela Ministerium</p>
      </section>
    </main>
  );
}
