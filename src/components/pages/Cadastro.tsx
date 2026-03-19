"use client";

import Image from "next/image";
import React, { FormEvent, useState } from "react";
import Input from "@/components/input";
import Button from "@/components/Button";
import LoadingIndicator from "../loadingIndicator";
import { ResponseCode, useIgrejas, useUsuarios } from "@/hooks";
import { toast } from "sonner";

type TiposPage = {
  page: boolean;
  setPage: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Cadastro({ page, setPage }: TiposPage) {
  const { create: createIgreja, getAll: getIgrejas, loading: loadingIgreja } = useIgrejas();
  const { create: createUsuario, loading: loadingUsuario } = useUsuarios();

  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [igrejaIdCriada, setIgrejaIdCriada] = useState<number | null>(null);

  const [igrejaForm, setIgrejaForm] = useState({
    nome: "",
    cnpj: "",
    estado: "",
    rua: "",
    cep: "",
    numero: "",
  });

  const [usuarioForm, setUsuarioForm] = useState({
    nome: "",
    sobrenome: "",
    telefone: "",
    email: "",
    senha: "",
    idTipoUsuario: 1,
  });

  const cadastrarIgreja = async (e: FormEvent) => {
    e.preventDefault();

    const result = await createIgreja(igrejaForm);
    if (result.code !== ResponseCode.SUCCESS) {
      toast.error(result.message || "Erro ao cadastrar igreja");
      return;
    }

    let idIgreja = result.data?.id || 0;

    if (!idIgreja) {
      const lista = await getIgrejas();
      const encontrada = (lista.data || [])
        .filter((igreja) => igreja.cnpj === igrejaForm.cnpj)
        .sort((a, b) => (b.id || 0) - (a.id || 0))[0];
      idIgreja = encontrada?.id || 0;
    }

    if (!idIgreja) {
      toast.error("Igreja cadastrada, mas nao foi possivel obter o ID. Tente novamente.");
      return;
    }

    setIgrejaIdCriada(idIgreja);
    setEtapa(2);
    toast.success("Igreja cadastrada. Agora cadastre o usuario.");
  };

  const cadastrarUsuario = async (e: FormEvent) => {
    e.preventDefault();

    if (!igrejaIdCriada) {
      toast.error("Cadastre a igreja primeiro.");
      setEtapa(1);
      return;
    }

    const result = await createUsuario({
      ...usuarioForm,
      idIgreja: igrejaIdCriada,
    });

    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Cadastro concluido. Agora faca login.");
      setPage(false);
      return;
    }

    toast.error(result.message || "Erro ao cadastrar usuario");
  };

  const loading = loadingIgreja || loadingUsuario;

  return (
    <div className="relative gap-3 flex w-full h-screen">
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
              {etapa === 1 ? "Cadastrar Igreja" : "Cadastrar Usuario"}
            </h1>
            <h3 className="text-textLight/80 text-lg">
              Ja tem uma conta?{" "}
              <strong className="hover:text-primary cursor-pointer transition-all duration-300" onClick={() => setPage(!page)}>
                Clique aqui!
              </strong>
            </h3>
          </div>

          {etapa === 1 ? (
            <form className="gap-2 flex flex-col w-full" onSubmit={cadastrarIgreja}>
              <Input placeholder="Nome da Igreja" value={igrejaForm.nome} onChange={(e) => setIgrejaForm({ ...igrejaForm, nome: e.target.value })} required />
              <Input placeholder="CNPJ" value={igrejaForm.cnpj} onChange={(e) => setIgrejaForm({ ...igrejaForm, cnpj: e.target.value })} required />
              <Input placeholder="Estado (UF)" value={igrejaForm.estado} onChange={(e) => setIgrejaForm({ ...igrejaForm, estado: e.target.value })} required />
              <Input placeholder="Rua" value={igrejaForm.rua} onChange={(e) => setIgrejaForm({ ...igrejaForm, rua: e.target.value })} required />
              <Input placeholder="CEP" value={igrejaForm.cep} onChange={(e) => setIgrejaForm({ ...igrejaForm, cep: e.target.value })} required />
              <Input placeholder="Numero" value={igrejaForm.numero} onChange={(e) => setIgrejaForm({ ...igrejaForm, numero: e.target.value })} required />

              <Button type="submit">{loading ? <LoadingIndicator /> : "Cadastrar Igreja e Continuar"}</Button>
              <button
                type="button"
                className="h-[44px] rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition"
                onClick={() => setPage(false)}
              >
                Voltar para Login
              </button>
            </form>
          ) : (
            <form className="gap-2 flex flex-col w-full" onSubmit={cadastrarUsuario}>
              <div className="text-sm text-neutral-600 bg-neutral-100 p-2 rounded">Igreja ID: {igrejaIdCriada}</div>

              <Input placeholder="Nome" value={usuarioForm.nome} onChange={(e) => setUsuarioForm({ ...usuarioForm, nome: e.target.value })} required />
              <Input placeholder="Sobrenome" value={usuarioForm.sobrenome} onChange={(e) => setUsuarioForm({ ...usuarioForm, sobrenome: e.target.value })} required />
              <Input placeholder="Telefone" value={usuarioForm.telefone} onChange={(e) => setUsuarioForm({ ...usuarioForm, telefone: e.target.value })} required />
              <Input placeholder="E-mail" type="email" value={usuarioForm.email} onChange={(e) => setUsuarioForm({ ...usuarioForm, email: e.target.value })} required />
              <Input placeholder="Senha" type="password" value={usuarioForm.senha} onChange={(e) => setUsuarioForm({ ...usuarioForm, senha: e.target.value })} required />
              <Input
                placeholder="ID Tipo de Usuario"
                type="number"
                value={String(usuarioForm.idTipoUsuario)}
                onChange={(e) => setUsuarioForm({ ...usuarioForm, idTipoUsuario: Number(e.target.value || 1) })}
                required
              />

              <Button type="submit">{loading ? <LoadingIndicator /> : "Finalizar Cadastro"}</Button>
              <button
                type="button"
                className="h-[44px] rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition"
                onClick={() => setEtapa(1)}
              >
                Voltar para Etapa da Igreja
              </button>
            </form>
          )}
        </div>

        <p className="text-sm font-light opacity-70">Feito pela Ministerium</p>
      </div>

      <div className="bg-gradient rounded-l-2xl col-span-1 flex-col max-w-[70%] flex-1 items-start justify-center text-textDark p-20 hidden xl:flex ">
        <div className="flex flex-col text-textDark gap-2 ml-10">
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
