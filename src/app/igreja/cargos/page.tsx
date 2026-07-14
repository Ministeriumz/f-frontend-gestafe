"use client";
//* Libraries imports

//* Libraries imports
import React, { useEffect, useMemo } from "react";
import { toast } from "sonner";

//* Components imports
import Table, { Column } from "@/components/table/table";
import Loading from "@/components/loading/loading";

//* Hooks imports
import { ResponseCode, useCargos, CargoDTO } from "@/hooks";

type CargoView = {
  idCargo: number;
  nome: string;
};

const columns: Column<CargoView>[] = [
  { key: "idCargo", label: "ID Cargo" },
  { key: "nome", label: "Nome" },
];

export default function CargosPage() {
  const { data, loading, error, getAll, create, update, remove } = useCargos();

  useEffect(() => {
    getAll();
  }, [getAll]);

  const rows = useMemo<CargoView[]>(
    () =>
      data.map((item) => ({
        idCargo: item.idCargo || 0,
        nome: item.nome,
      })),
    [data]
  );

  const onCreate = async (form: any) => {
    const result = await create({
      nome: String(form.nome || ""),
    });
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Cargo criado com sucesso");
      getAll();
      return;
    }
    toast.error(result.message);
  };

  const onEdit = async (row: CargoView) => {
    const result = await update({
      idCargo: row.idCargo,
      nome: row.nome,
    });
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Cargo atualizado");
      getAll();
      return;
    }
    toast.error(result.message);
  };

  const onDelete = async (row: CargoView) => {
    const result = await remove(row.idCargo);
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Cargo removido");
      return;
    }
    toast.error(result.message);
  };

  if (loading) return <Loading />;
  if (error) return <div className="p-4 text-danger">{error}</div>;

  return (
    <Table
      columns={columns}
      data={rows}
      columnsSearch={["nome"]}
      actions={[
        { name: "Editar", func: onEdit, type: "edit" },
        { name: "Excluir", func: onDelete, type: "delete" },
        { name: "Cadastrar", func: onCreate, type: "create" },
      ]}
      onCreate={onCreate}
      onEdit={onEdit}
      onDelete={onDelete}
      formFields={[{ key: "nome", placeholder: "Nome" }]}
    />
  );
}
