"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Filter, UsersRound } from "lucide-react";
import { toast } from "sonner";
import Table, { type Column } from "@/components/table/table";
import Loading from "@/components/loading/loading";
import { ResponseCode, useCargos, useCargosUsuario, useIgrejas, useTiposUsuario, useUsuarios } from "@/hooks";
import { getSessionUser } from "@/lib/auth";

type MembroView = {
  id: number; nome: string; sobrenome: string; telefone: string; email: string; senha: string;
  idIgreja: number; idTipoUsuario: number; cargoIds: number[]; cargos: string;
};

export default function MembrosPage() {
  const { data, loading, error, getAll, create, update, remove } = useUsuarios();
  const { data: igrejas, getAll: getAllIgrejas } = useIgrejas();
  const { data: tipos, getAll: getAllTipos } = useTiposUsuario();
  const { data: cargos, getAll: getAllCargos } = useCargos();
  const { data: vinculos, getAll: getAllVinculos, create: vincularCargo, remove: removerCargo } = useCargosUsuario();
  const [cargoFiltro, setCargoFiltro] = useState("todos");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const currentUserId = Number(getSessionUser().userId);

  const recarregar = async () => { await Promise.all([getAll(), getAllVinculos()]); };
  useEffect(() => { void Promise.all([getAll(), getAllIgrejas(), getAllTipos(), getAllCargos(), getAllVinculos()]); }, [getAll, getAllIgrejas, getAllTipos, getAllCargos, getAllVinculos]);

  const rows = useMemo<MembroView[]>(() => data.filter((usuario) => usuario.id !== currentUserId).map((usuario) => {
    const cargoIds = vinculos.filter((vinculo) => vinculo.idUsuario === usuario.id).map((vinculo) => vinculo.idCargo);
    const nomesCargos = cargoIds.map((id) => cargos.find((cargo) => cargo.idCargo === id)?.nome).filter(Boolean) as string[];
    return { id: usuario.id || 0, nome: usuario.nome, sobrenome: usuario.sobrenome, telefone: usuario.telefone, email: usuario.email, senha: usuario.senha || "", idIgreja: usuario.idIgreja, idTipoUsuario: usuario.idTipoUsuario, cargoIds, cargos: nomesCargos.join(", ") || "Sem cargo definido" };
  }), [cargos, currentUserId, data, vinculos]);

  const filteredRows = useMemo(() => rows.filter((row) => (cargoFiltro === "todos" || (cargoFiltro === "sem-cargo" ? row.cargoIds.length === 0 : row.cargoIds.includes(Number(cargoFiltro))) ) && (tipoFiltro === "todos" || row.idTipoUsuario === Number(tipoFiltro))), [cargoFiltro, rows, tipoFiltro]);
  const columns = useMemo<Column<MembroView>[]>(() => [
    { key: "nome", label: "Membro", render: (value, row) => <div><p className="font-semibold text-foreground">{value} {row.sobrenome}</p><p className="text-xs text-muted-foreground">{row.email}</p></div> },
    { key: "cargos", label: "Funções na equipe", render: (value) => value === "Sem cargo definido" ? <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">Sem função</span> : <div className="flex max-w-64 flex-wrap gap-1">{String(value).split(", ").map((cargo) => <span key={cargo} className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{cargo}</span>)}</div> },
    { key: "idTipoUsuario", label: "Perfil", render: (value) => <span className="rounded-full border border-border px-2 py-1 text-xs">{tipos.find((tipo) => tipo.id === Number(value))?.nome ?? "Não informado"}</span> },
    { key: "telefone", label: "Contato" },
  ], [tipos]);

  const syncCargos = async (usuarioId: number, selecionados: unknown) => {
    const desejados = Array.isArray(selecionados) ? selecionados.map(Number).filter(Boolean) : [];
    const atuais = vinculos.filter((vinculo) => vinculo.idUsuario === usuarioId).map((vinculo) => vinculo.idCargo);
    const removidos = atuais.filter((id) => !desejados.includes(id));
    const adicionados = desejados.filter((id) => !atuais.includes(id));
    const resultados = await Promise.all([...removidos.map((id) => removerCargo(usuarioId, id)), ...adicionados.map((id) => vincularCargo({ idUsuario: usuarioId, idCargo: id }))]);
    return resultados.every((result) => result.code === ResponseCode.SUCCESS);
  };

  const onCreate = async (form: Record<string, unknown>) => {
    const result = await create({ nome: String(form.nome || ""), sobrenome: String(form.sobrenome || ""), telefone: String(form.telefone || ""), email: String(form.email || ""), senha: String(form.senha || ""), idIgreja: Number(form.idIgreja), idTipoUsuario: Number(form.idTipoUsuario) });
    if (result.code !== ResponseCode.SUCCESS || !result.data?.id) { toast.error(result.message || "Não foi possível cadastrar o membro."); return; }
    if (!(await syncCargos(result.data.id, form.cargoIds))) toast.error("Membro criado, mas não foi possível atualizar todas as funções.");
    else toast.success("Membro e funções cadastrados com sucesso.");
    await recarregar();
  };
  const onEdit = async (row: MembroView) => {
    const result = await update({ id: row.id, nome: row.nome, sobrenome: row.sobrenome, telefone: row.telefone, email: row.email, senha: row.senha || "", idIgreja: Number(row.idIgreja), idTipoUsuario: Number(row.idTipoUsuario) });
    if (result.code !== ResponseCode.SUCCESS) { toast.error(result.message); return; }
    if (!(await syncCargos(row.id, row.cargoIds))) toast.error("Dados atualizados, mas houve falha ao atualizar alguma função.");
    else toast.success("Membro e funções atualizados.");
    await recarregar();
  };
  const onDelete = async (row: MembroView) => { const result = await remove(row.id); if (result.code === ResponseCode.SUCCESS) { toast.success("Membro removido."); await recarregar(); } else toast.error(result.message); };

  if (loading && !data.length) return <Loading />;
  if (error && !data.length) return <div className="flex items-center justify-center p-8 text-danger">Erro: {error}</div>;

  return <section className="space-y-4"><header className="flex flex-wrap items-end justify-between gap-3 rounded-xl border border-border bg-card p-4"><div><div className="mb-1 flex items-center gap-2 text-primary"><UsersRound className="size-4" /><span className="text-xs font-bold uppercase tracking-wider">Equipe de serviço</span></div><h1 className="text-xl font-semibold">Membros e funções</h1><p className="mt-1 text-sm text-muted-foreground">Veja rapidamente quem faz o quê e mantenha a equipe pronta para as escalas.</p></div><span className="rounded-lg bg-muted px-3 py-2 text-sm font-medium">{filteredRows.length} membro(s)</span></header>
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-3"><div className="flex items-center gap-2 text-sm font-medium"><Filter className="size-4 text-primary" /> Filtrar equipe</div><label className="grid gap-1 text-xs text-muted-foreground">Função<select className="h-8 min-w-44 rounded-md border border-border bg-background px-2 text-sm text-foreground" value={cargoFiltro} onChange={(e) => setCargoFiltro(e.target.value)}><option value="todos">Todas as funções</option><option value="sem-cargo">Sem função</option>{cargos.map((cargo) => <option key={cargo.idCargo} value={cargo.idCargo}>{cargo.nome}</option>)}</select></label><label className="grid gap-1 text-xs text-muted-foreground">Perfil<select className="h-8 min-w-40 rounded-md border border-border bg-background px-2 text-sm text-foreground" value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}><option value="todos">Todos os perfis</option>{tipos.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>)}</select></label><button type="button" className="h-8 text-xs text-primary underline" onClick={() => { setCargoFiltro("todos"); setTipoFiltro("todos"); }}>Limpar filtros</button></div>
    <Table columns={columns} data={filteredRows} columnsSearch={["nome", "cargos", "email"]} actions={[{ name: "Editar", func: onEdit, type: "edit" }, { name: "Excluir", func: onDelete, type: "delete" }]} onCreate={onCreate} onEdit={onEdit} onDelete={onDelete} formFields={[
      { key: "nome", placeholder: "Nome", validate: (value) => String(value).trim().length < 2 ? "Informe ao menos 2 caracteres." : undefined }, { key: "sobrenome", placeholder: "Sobrenome", validate: (value) => String(value).trim().length < 2 ? "Informe ao menos 2 caracteres." : undefined }, { key: "telefone", placeholder: "Telefone", validate: (value) => String(value).replace(/\D/g, "").length < 10 ? "Informe um telefone válido." : undefined }, { key: "email", placeholder: "E-mail", type: "email", validate: (value) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(value)) ? undefined : "Informe um e-mail válido." }, { key: "senha", placeholder: "Senha", type: "password", required: (mode) => mode === "create", validate: (value) => String(value).length > 0 && String(value).length < 8 ? "A senha deve ter ao menos 8 caracteres." : undefined }, { key: "idIgreja", placeholder: "Igreja", type: "search-select", options: igrejas.map((igreja) => ({ label: `${igreja.nome} (${igreja.cnpj})`, value: igreja.id || 0 })) }, { key: "idTipoUsuario", placeholder: "Tipo de usuário", type: "search-select", options: tipos.map((tipo) => ({ label: tipo.nome, value: tipo.id || 0 })) }, { key: "cargoIds", placeholder: "Funções que pode exercer", type: "multi-select", required: false, options: cargos.map((cargo) => ({ label: cargo.nome, value: cargo.idCargo || 0 })) },
    ]} />
  </section>;
}
