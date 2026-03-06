"use client"
import React, { useEffect, useState } from 'react'
import Table, { Column } from '@/components/Table/table'
import { useEventos, EventoDTO, ResponseCode } from '@/hooks'
import Loading from '@/components/Loading/loading'

type EventoView = {
  id: number
  nome: string
  tipo: string
  resumo: string
  data: string
  hora_inicio: string
  hora_fim: string
}

const columns: Column<EventoView>[] = [
  { key: 'id', label: 'ID' },
  { key: 'nome', label: 'Nome' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'resumo', label: 'Resumo' },
  { key: 'data', label: 'Data' },
  { key: 'hora_inicio', label: 'Início' },
  { key: 'hora_fim', label: 'Fim' },
]

export default function EventosPage() {
  const { data, loading, error, getAll, create, update, remove } = useEventos()
  const [eventos, setEventos] = useState<EventoView[]>([])

  useEffect(() => {
    getAll()
  }, [getAll])

  useEffect(() => {
    const eventosView: EventoView[] = data.map(e => ({
      id: e.id || 0,
      nome: e.nome,
      tipo: e.tipo,
      resumo: e.resumo,
      data: e.data,
      hora_inicio: e.hora_inicio,
      hora_fim: e.hora_fim,
    }))
    setEventos(eventosView)
  }, [data])

  const editar = async (row: EventoView) => {
    const nome = prompt('Nome do evento:', row.nome)
    const tipo = prompt('Tipo do evento:', row.tipo)
    const resumo = prompt('Resumo:', row.resumo)
    const dataEvento = prompt('Data (yyyy-MM-dd):', row.data)
    const horaInicio = prompt('Hora início (HH:mm:ss):', row.hora_inicio)
    const horaFim = prompt('Hora fim (HH:mm:ss):', row.hora_fim)
    
    if (nome && tipo && resumo && dataEvento && horaInicio && horaFim) {
      const result = await update({
        id: row.id,
        nome,
        tipo,
        resumo,
        data: dataEvento,
        hora_inicio: horaInicio,
        hora_fim: horaFim
      })
      if (result.code === ResponseCode.SUCCESS) {
        alert('Evento atualizado com sucesso!')
      } else {
        alert(`Erro: ${result.message}`)
      }
    }
  }

  const excluir = async (row: EventoView) => {
    if (confirm(`Deseja realmente excluir o evento ${row.nome}?`)) {
      const result = await remove(row.id)
      if (result.code === ResponseCode.SUCCESS) {
        alert('Evento excluído com sucesso!')
      } else {
        alert(`Erro ao excluir: ${result.message}`)
      }
    }
  }

  const adicionar = async () => {
    const nome = prompt('Nome do evento:')
    const tipo = prompt('Tipo do evento:')
    const resumo = prompt('Resumo:')
    const dataEvento = prompt('Data (yyyy-MM-dd):')
    const horaInicio = prompt('Hora início (HH:mm:ss):')
    const horaFim = prompt('Hora fim (HH:mm:ss):')
    
    if (nome && tipo && resumo && dataEvento && horaInicio && horaFim) {
      const result = await create({
        nome,
        tipo,
        resumo,
        data: dataEvento,
        hora_inicio: horaInicio,
        hora_fim: horaFim
      })
      if (result.code === ResponseCode.SUCCESS) {
        alert('Evento criado com sucesso!')
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
          + Adicionar Evento
        </button>
      </div>
      <Table 
        columns={columns} 
        data={eventos} 
        columnsSearch={['nome', 'tipo', 'resumo']} 
        actions={actions}
      />
    </div>
  )
}
