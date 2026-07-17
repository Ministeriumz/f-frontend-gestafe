"use client";
//* Libraries imports

//* Libraries imports
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import { toast } from "sonner";

//* Components imports
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

//* Hooks imports
import { ResponseCode, useUsuarios } from "@/hooks";

//* Utilities imports
import LoadingIndicator from "../loadingIndicator";

type TiposPage = {
  page: boolean;
  setPage: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Cadastro({ page, setPage }: TiposPage) {
  const { create: createUsuario, loading: loadingUsuario } = useUsuarios();

  const [usuarioForm, setUsuarioForm] = useState({
    nome: "",
    sobrenome: "",
    telefone: "",
    email: "",
    senha: "",
    idTipoUsuario: 1,
  });

  const cadastrarUsuario = async (e: FormEvent) => {
    e.preventDefault();

    const result = await createUsuario({
      ...usuarioForm,
      idTipoUsuario: 1,
    });

    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Cadastro de membro concluido. Agora faca login.");
      setPage(false);
      return;
    }

    toast.error(result.message || "Erro ao cadastrar usuario");
  };

  const loading = loadingUsuario;

  return (
    <div className="relative gap-3 flex w-full h-screen">
      <div className="flex flex-1 flex-col items-center justify-start p-6 col-span-1 text-muted w-full lg:max-w-[40%]">
        <div className="w-full grid grid-cols-3 justify-center items-center">
          <div />
          <div className="flex flex-1 items-center justify-center">
            <Image src="/gestafepreto.png" width={100} height={100} alt="logo" className="opacity-30 mt-5" />
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-3 items-center justify-center w-full !text-xl max-w-[400px]">
          <div className="flex flex-col w-full gap-0 p-0 mb-5">
            <h1 className="text-3xl xl:text-4xl font-medium text-start w-full mb-4 leading-tight">
              Cadastrar Usuario
            </h1>
            <h3 className="text-muted/80 text-lg">
              Ja tem uma conta?{" "}
              <strong className="hover:text-primary cursor-pointer transition-all duration-300" onClick={() => setPage(!page)}>
                Clique aqui!
              </strong>
            </h3>
          </div>

          <form className="gap-2 flex flex-col w-full" onSubmit={cadastrarUsuario}>
            <Input placeholder="Nome" value={usuarioForm.nome} onChange={(e) => setUsuarioForm({ ...usuarioForm, nome: e.target.value })} required />
            <Input placeholder="Sobrenome" value={usuarioForm.sobrenome} onChange={(e) => setUsuarioForm({ ...usuarioForm, sobrenome: e.target.value })} required />
            <Input placeholder="Telefone" type="telefone" value={usuarioForm.telefone} onValueChange={(telefone) => setUsuarioForm({ ...usuarioForm, telefone })} required />
            <Input placeholder="E-mail" type="email" value={usuarioForm.email} onChange={(e) => setUsuarioForm({ ...usuarioForm, email: e.target.value })} required />
            <Input placeholder="Senha" type="password" value={usuarioForm.senha} onChange={(e) => setUsuarioForm({ ...usuarioForm, senha: e.target.value })} required />

            <div className="text-sm text-muted bg-surface-soft p-2 rounded">
              Seu cadastro sera criado como membro.
            </div>

            <Button type="submit" size="lg">{loading ? <LoadingIndicator /> : "Finalizar Cadastro"}</Button>
            <button
              type="button"
              className="h-[44px] rounded-lg border border-border-strong text-muted hover:bg-surface-soft transition"
              onClick={() => setPage(false)}
            >
              Voltar para Login
            </button>
          </form>
        </div>

        <p className="text-sm font-light opacity-70">Feito pela Ministerium</p>
      </div>

      <div className="bg-gradient rounded-l-2xl col-span-1 flex-col max-w-[70%] flex-1 items-start justify-center text-subtle p-20 hidden xl:flex ">
        <div className="flex flex-col text-subtle gap-2 ml-10">
          <h1 className="text-4xl xl:text-6xl font-semibold">A fe move as pessoas</h1>
          <p className="text-lg xl:text-2xl font-extralight">E estamos aqui para ajudar voce a se mover!</p>
        </div>
        <div className="flex flex-1 w-full">
          <Image src="/imgCadastro.svg" alt="img-login" height={100} width={100} className="flex flex-1 p-20" />
        </div>
      </div>
    </div>
  );
}
