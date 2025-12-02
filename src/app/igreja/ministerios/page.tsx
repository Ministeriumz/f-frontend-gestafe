import React from 'react'
import Table, { Column } from '@/components/Table/table'

type Ministerio = {
  id_ministerio: number
  nome: string
  tamanho_max: number
}

const columns: Column<Ministerio>[] = [
  { key: 'id_ministerio', label: 'ID' },
  { key: 'nome', label: 'Nome' },
  { key: 'tamanho_max', label: 'Tamanho Máximo' },
]

const data: Ministerio[] = [
  { id_ministerio: 1, nome: 'Louvor', tamanho_max: 20 },
  { id_ministerio: 2, nome: 'Infantil', tamanho_max: 15 },
]

export default function page() {
  return (
    <Table columns={columns} data={data} columnsSearch={['nome']} />
  )
}
