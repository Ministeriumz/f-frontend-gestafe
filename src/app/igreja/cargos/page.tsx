"use client"
import React, { useEffect, useState } from 'react'
import Table, { Column } from '@/components/Table/table'
import { useTiposUsuario, ResponseCode } from '@/hooks'
import Loading from '@/components/Loading/loading'


type CargoView = {
  id: number
  nome: string
}

const columns: Column<CargoView>[] = [
  { key: 'id', label: 'ID' },
  { key: 'nome', label: 'Nome' },
]

export default function CargosPage() {
  const { data, loading, error, getAll, create, update, remove, atualizarParcial } = useTiposUsuario()
  const [cargos, setCargos] = useState<CargoView[]>([])

  useEffect(() => {
    getAll()
  }, [getAll])

  useEffect(() => {
    const cargosView: CargoView[] = data.map(c => ({
      id: c.id || 0,
      nome: c.nome,
    }))
    setCargos(cargosView)
  }, [data])

  const editar = async (row: CargoView) => {
    const novoNome = prompt('Novo nome do cargo:', row.nome)
    
    if (novoNome) {
      const result = await atualizarParcial(row.id, { nome: novoNome })
      if (result.code === ResponseCode.SUCCESS) {
        alert('Cargo atualizado com sucesso!')
        getAll() // Recarrega os dados
      } else {
        alert(`Erro: ${result.message}`)
      }
    }
  }

  const excluir = async (row: CargoView) => {
    if (confirm(`Deseja realmente excluir o cargo ${row.nome}?`)) {
      const result = await remove(row.id)
      if (result.code === ResponseCode.SUCCESS) {
        alert('Cargo excluído com sucesso!')
      } else {
        alert(`Erro ao excluir: ${result.message}`)
      }
    }
  }

  const adicionar = async () => {
    const nome = prompt('Nome do cargo:')
    
    if (nome) {
      const result = await create({ nome })
      if (result.code === ResponseCode.SUCCESS) {
        alert('Cargo criado com sucesso!')
      } else {
        alert(`Erro: ${result.message}`)
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
    <div>
      <div className="mb-4">
        <button 
          onClick={adicionar}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Adicionar Cargo
        </button>
      </div>
      <Table 
        columns={columns} 
        data={cargos} 
        columnsSearch={['nome']} 
        actions={actions} 
      />
    </div>
  )
}
