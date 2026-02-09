'use client'
import React, { useState } from 'react'
import Carrossel from './carrossel'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import DateRangeIcon from '@mui/icons-material/DateRange'

export default function Page() {
  const [periodo, setPeriodo] = useState('30 dias')

  type CardProps = {
    type: 'doacoes' | 'gastos'
  }

  const Card = ({ type }: CardProps) => {
    const types = {
      doacoes: {
        title: 'Doações',
        icon: <AttachMoneyIcon fontSize="small" className="text-primary" />,
      },
      gastos: {
        title: 'Gastos',
        icon: <span className="text-primary text-sm">📊</span>,
      },
    }

    const current = types[type]

    return (
      <div className="bg-white rounded-xl border border-neutral-200/60 shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-neutral-600">
            <div className="w-8 h-8 rounded-md bg-neutral-100 flex items-center justify-center">
              {current.icon}
            </div>
            <h3 className="font-medium text-sm uppercase tracking-wide">
              {current.title}
            </h3>
          </div>

          <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <ArrowUpwardIcon sx={{ fontSize: 14 }} />
            72%
          </div>
        </div>

        {/* Valor */}
        <div className="flex flex-col gap-1">
          <span className="text-neutral-400 text-xs uppercase tracking-wide">
            Total no período
          </span>
          <span className="text-neutral-800 font-semibold text-2xl">
            R$ 15.742,20
          </span>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
          <span className="text-neutral-400 text-xs">
            Atualizado agora
          </span>

          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="bg-neutral-50 border border-neutral-200 text-neutral-600 text-xs px-3 py-1 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="7 dias">7 dias</option>
            <option value="30 dias">30 dias</option>
            <option value="90 dias">90 dias</option>
          </select>
        </div>
      </div>
    )
  }

  const CardEventos = () => {
    const eventos = [
      { nome: 'Feira' },
      { nome: 'Churrasco' },
    ]

    return (
      <div className="bg-white rounded-xl border border-neutral-200/60 shadow-sm hover:shadow-md transition-all p-6 flex flex-col h-full">
        <div className="mb-4">
          <h3 className="text-neutral-700 font-medium text-sm uppercase tracking-wide">
            Próximos eventos
          </h3>
          <p className="text-neutral-400 text-xs mt-1">
            Eventos agendados no calendário
          </p>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          {eventos.map((evento, index) => (
            <div
              key={index}
              className="group flex items-center justify-between p-3 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-white hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-white border border-neutral-200 flex items-center justify-center text-neutral-600">
                  <DateRangeIcon fontSize="small" />
                </div>
                <span className="text-sm font-medium text-neutral-700">
                  {evento.nome}
                </span>
              </div>

              <span className="text-xs text-neutral-400 group-hover:text-neutral-600 transition">
                Ver
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen p-3 sm:p-0 gap-4 ">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-700 leading-tight">
          Seja bem-vindo
        </h1>
        <p className="text-neutral-400 text-sm max-w-xl">
          Aqui está o resumo da sua atividade recente.
        </p>
      </div>

      {/* Carrossel */}
      <Carrossel />

      {/* Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-7 gap-4 flex-1 pb-4">
        <div className="flex flex-col gap-4 lg:col-span-3 order-2 lg:order-1">
          <Card type="doacoes" />
          <Card type="gastos" />
        </div>

        <div className="lg:col-span-4 order-1 lg:order-2">
          <CardEventos />
        </div>
      </div>
    </div>
  )
}
