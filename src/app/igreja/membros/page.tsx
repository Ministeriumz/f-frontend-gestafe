"use client"
import React from 'react'
import Table, { Column } from '@/components/Table/table'

type Membros = {
  id_usuario: number
  nome: string
  sobrenome: string
  telefone: number
  email: string
}

const columns: Column<Membros>[] = [
  { key: 'id_usuario', label: 'ID' },
  { key: 'nome', label: 'Nome' },
  { key: 'sobrenome', label: 'Sobrenome' },
  { key: 'telefone', label: 'Telefone' },
  { key: 'email', label: 'Email' },
]

const data: Membros[] = [
  { id_usuario: 1, nome: 'Roberto', sobrenome: 'Silva', telefone: 123456789, email: 'padre.silva@example.com' },
  { id_usuario: 2, nome: 'Carlos', sobrenome: 'Souza', telefone: 987654321, email: 'gerente.souza@example.com' },
]

const editar = (row: Membros) => {
  alert(`Editando membro: ${row.nome}`)
  return;
}

const excluir = (row: Membros) => {
  alert(`Excluindo membro: ${row.nome}`)
  return;
}

const actions = [
  { name: 'Editar', func: editar, color: '#82ACAA' },
  { name: 'Excluir', func: excluir, color: '#AC8282' },
]

export default function page() {
  return (
    <Table columns={columns} data={data} columnsSearch={['nome', 'sobrenome', 'email']} actions={actions} />
  )
}
