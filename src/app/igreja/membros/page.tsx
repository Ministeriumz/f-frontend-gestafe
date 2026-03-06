"use client"
import React, { useEffect, useState } from 'react'
import Table, { Column } from '@/components/Table/table'
import { useUsuarios, ResponseCode } from '@/hooks'
import Loading from '@/components/Loading/loading'

type MembroView = {
  id: number
  nome: string
  sobrenome: string
  telefone: string
  email: string
}

const columns: Column<MembroView>[] = [
  { key: 'id', label: 'ID' },
  { key: 'nome', label: 'Nome' },
  { key: 'sobrenome', label: 'Sobrenome' },
  { key: 'telefone', label: 'Telefone' },
  { key: 'email', label: 'Email' },
]

export default function MembrosPage() {
  const { data, loading, error, getAll, remove } = useUsuarios()
  const [membros, setMembros] = useState<MembroView[]>([])

  useEffect(() => {
    getAll()
  }, [getAll])

  useEffect(() => {
    // Transforma UsuarioDTO em MembroView para exibição
    const membrosView: MembroView[] = data.map(usuario => ({
      id: usuario.id || 0,
      nome: usuario.nome,
      sobrenome: usuario.sobrenome,
      telefone: usuario.telefone,
      email: usuario.email,
    }))
    setMembros(membrosView)
  }, [data])

  const editar = (row: MembroView) => {
    alert(`Editando membro: ${row.nome} ${row.sobrenome}`)
    // Aqui você pode abrir um modal de edição
  }

  const excluir = async (row: MembroView) => {
    if (confirm(`Deseja realmente excluir o membro ${row.nome} ${row.sobrenome}?`)) {
      const result = await remove(row.id)
      if (result.code === ResponseCode.SUCCESS) {
        alert('Membro excluído com sucesso!')
      } else {
        alert(`Erro ao excluir: ${result.message}`)
      }
    }
  }

  const actions = [
    { name: 'Editar', func: editar, color: '#82ACAA' },
    { name: 'Excluir', func: excluir, color: '#AC8282' },
  ]

  if (loading) {
    return <Loading/>
  }

  if (error) {
    return <div className="flex justify-center items-center p-8 text-red-500">Erro: {error}</div>
  }

  return (
    <Table 
      columns={columns} 
      data={membros} 
      columnsSearch={['nome', 'sobrenome', 'email']} 
      actions={actions} 
    />
  )
}
