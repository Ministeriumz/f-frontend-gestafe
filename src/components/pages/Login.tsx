"use client";

import Image from "next/image";
import React, { FormEvent, useState } from "react";
import Input from "@/components/input";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import LoadingIndicator from "../loadingIndicator";
import { useAuth, ResponseCode } from "@/hooks";
import { toast } from "sonner";

type TiposPage = {
  page: boolean;
  setPage: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Login({ page, setPage }: TiposPage) {
  const router = useRouter();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await login({ email, senha });

    if (result.code === ResponseCode.SUCCESS && result.data?.token) {
      toast.success("Login realizado com sucesso");
      router.push("/igreja/dashboard");
      return;
    }

    toast.error(result.message || "Falha no login");
  };

  return (
    <div className="relative gap-3 flex w-full h-screen">
      <div className="bg-gradient col-span-1 flex-col max-w-[70%] flex-1 items-start justify-center text-textDark rounded-r-2xl p-20 hidden xl:flex ">
        <div className="flex flex-col text-textDark gap-2 ml-10">
          <h1 className="text-4xl xl:text-6xl font-semibold">A fe move as pessoas</h1>
          <p className="text-lg xl:text-2xl font-extralight">E estamos aqui para ajudar voce a se mover!</p>
        </div>
        <div className="flex flex-1 w-full">
          <Image src="/imgLogin.svg" alt="img-login" height={100} width={100} className="flex flex-1 p-20" />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-start p-6 col-span-1 text-textLight w-full lg:max-w-[40%]">
        <div className="w-full grid grid-cols-3 justify-center items-center">
          <div />
          <div className="flex flex-1 items-center justify-center">
            <Image src="/gestafepreto.png" width={100} height={100} alt="logo" className="opacity-30 mt-5" />
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-3 items-center justify-center w-full !text-xl max-w-[400px]">
          <div className="flex flex-col w-full gap-0 p-0 mb-5">
            <h1 className="text-3xl xl:text-4xl font-medium text-start w-full mb-4 leading-tight">
              Acessar o <br /> <strong className="font-semibold text-5xl xl:text-7xl">GestaFe</strong>
            </h1>
            <h3 className="text-textLight/80 text-lg">
              Nao tem uma conta?{" "}
              <strong className="hover:text-primary cursor-pointer transition-all duration-300" onClick={() => setPage(!page)}>
                Clique aqui!
              </strong>
            </h3>
          </div>
          <form className="gap-2 flex flex-col w-full" onSubmit={onSubmit}>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <Input
              placeholder="Senha"
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
            />
            <Button type="submit">{loading ? <LoadingIndicator /> : "Acessar"}</Button>
            <button
              type="button"
              className="h-[44px] rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition"
              onClick={() => setPage(true)}
            >
              Ir para Cadastro
            </button>
          </form>
        </div>
        <p className="text-sm font-light opacity-70">Feito pela Ministerium</p>
      </div>
    </div>
  );
}
