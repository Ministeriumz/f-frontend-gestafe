"use client"
import React, { useEffect, useState } from 'react'
import Table, { Column, Action } from '@/components/Table/table'
import { useMinisterios, MinisterioDTO, ResponseCode } from '@/hooks'
import Loading from '@/components/Loading/loading'
import { toast } from 'sonner';

type MinisterioView = {
  id: number
  nome: string
  tamanho_max: number
}

const columns: Column<MinisterioView>[] = [
  { key: 'id', label: 'ID' },
  { key: 'nome', label: 'Nome' },
  { key: 'tamanho_max', label: 'Tamanho Máximo' },
]

export default function MinisteriosPage() {
  const { data, loading, error, getAll, create, update, remove } = useMinisterios()
  const [ministerios, setMinisterios] = useState<MinisterioView[]>([])
  const [tipo, setTipo] = useState<'create' | 'edit' | 'delete'>('create')

  useEffect(() => {
    getAll()
  }, [getAll])

  useEffect(() => {
    const ministeriosView: MinisterioView[] = data.map(m => ({
      id: m.id || 0,
      nome: m.nome,
      tamanho_max: m.tamanho_max,
    }))
    setMinisterios(ministeriosView)
  }, [data])

  const editar = (row: MinisterioView) => {
    if (!row) return;
    const novoNome = row.nome;
    const novoTamanho = row.tamanho_max;

    if (novoNome && novoTamanho) {
      update({
        id: row.id,
        nome: novoNome,
        tamanho_max: novoTamanho
      }).then(result => {
        if (result.code === ResponseCode.SUCCESS) {
          toast.success('Ministério atualizado com sucesso!')
        } else {
          toast.error(`Erro: ${result.message}`)
        }
      })
    }
  }

  const excluir = async (row: MinisterioView) => {
    if (!row) return;
    const result = await remove(row.id)
    if (result.code === ResponseCode.SUCCESS) {
      toast.success('Ministério excluído com sucesso!')
    } else {
      toast.error(`Erro ao excluir: ${result.message}`)
    }
  }

  const adicionar = async (ministerio?: MinisterioView) => {
    if (!ministerio) return;
    const nome = ministerio.nome;
    const tamanho = String(ministerio.tamanho_max);

    if (nome && tamanho) {
      const result = await create({
        nome,
        tamanho_max: parseInt(tamanho)
      })
      if (result.code === ResponseCode.SUCCESS) {
        toast.success('Ministério criado com sucesso!')
        await getAll()
      } else {
        toast.error(`Erro: ${result.message}`)
      }
    }
  }

  const actions: Action[] = [
    { name: 'Editar', func: editar, color: '#82ACAA', type: 'edit' },
    { name: 'Excluir', func: excluir, color: '#AC8282', type: 'delete' },
    { name: 'Cadastrar', func: adicionar, color: '#82ACAA', type: 'create' },
  ]

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div className="flex justify-center items-center p-8 text-red-500">Erro: {error}</div>
  }

  return (
    <div>
      <Table
        columns={columns}
        data={ministerios}
        columnsSearch={['nome']}
        actions={actions}
        tipo={tipo}
        onEdit={editar}
        onCreate={adicionar}
        onDelete={excluir}
        setTipo={setTipo}
      />
    </div>
  )
}
