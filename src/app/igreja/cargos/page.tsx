"use client"
import React from 'react'
import Table, { Column } from '@/components/Table/table'

type Cargos = {
  id_cargo: number
  nome: string
}

const columns: Column<Cargos>[] = [
  { key: 'id_cargo', label: 'ID' },
  { key: 'nome', label: 'Nome' },
]

const data: Cargos[] = [
  { id_cargo: 1, nome: 'Padre' },
  { id_cargo: 2, nome: 'Gerente' },
]

const editar = (row: Cargos) => {
  alert(`Editando cargo: ${row.nome}`)
  return;
}

const excluir = (row: Cargos) => {
  alert(`Excluindo cargo: ${row.nome}`)
  return;
}

const actions = [
  { name: 'Editar', func: editar, color: '#82ACAA' },
  { name: 'Excluir', func: excluir, color: '#AC8282' },
]

export default function page() {
  return (
    <Table columns={columns} data={data} columnsSearch={['nome']} actions={actions} />
  )
}
