'use client'
import React, { useState } from 'react'
import Carrossel from './carrossel'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DateRangeIcon from '@mui/icons-material/DateRange';

export default function Page() {

  const [periodo, setPeriodo] = useState('30 dias')

  type CardProps = {
  type: 'doacoes' | 'gastos'
}

  const Card = ({ type }: CardProps) => {
    const types = {
      doacoes: {
        title: 'Doações',
        icon: <AttachMoneyIcon />,
        css: 'bg-primary w-full min-h-[120px] rounded-lg shadow-md p-4 flex flex-col justify-between'
      },
      gastos: {
        title: 'Gastos',
        icon: '📊',
        css: 'bg-[#AC8282] w-full min-h-[120px] rounded-lg shadow-md p-4 flex flex-col justify-between'
      }
    }
    return (
      <div className={types[type]?.css || 'bg-primary w-full min-h-[120px] rounded-lg shadow-md p-4 flex flex-col justify-between'}>
        <div className='flex justify-between items-start'>
          <div>
            <div className='flex items-center gap-2'>
              <h3 className='text-white font-bold text-lg uppercase tracking-wide'>{types[type]?.title || "generico"}</h3>
              <span className='text-xl text-white'>{types[type]?.icon}</span>
            </div>
            <p className='text-white/70 text-xs mt-1'>O quanto o pessoal apoia a igreja financeiramente</p>
          </div>
          <div className='flex items-center gap-1 text-white'>
            <span className='text-sm font-semibold'>72%</span>
            <span className=''><ArrowUpwardIcon /></span>
          </div>
        </div>
        <div className='flex justify-between items-end mt-2'>
          <span className='text-white font-bold text-2xl sm:text-3xl'>R$ 15.742,20</span>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className='bg-white text-primary text-xs px-2 py-1 rounded-md cursor-pointer font-medium'
          >
            <option value="7 dias">7 dias</option>
            <option value="30 dias">30 dias</option>
            <option value="90 dias">90 dias</option>
          </select>
        </div>
      </div>
    )
  }

  // Card de Próximos Eventos
  const CardEventos = () => {
    const eventos = [
      { nome: 'Feira', cor: 'bg-yellow-200' },
      { nome: 'Churrasco', cor: 'bg-yellow-100' },
    ]

    return (
      <div className='bg-white w-full h-full rounded-lg shadow-md p-4 sm:p-6 flex flex-col'>
        <div className='mb-4'>
          <h3 className='text-neutral-700 font-bold text-xl uppercase tracking-wide'>Próximos Eventos</h3>
          <p className='text-neutral-400 text-sm'>Aqui você pode ver os próximos eventos agendados</p>
        </div>
        <div className='flex flex-col gap-3 flex-1'>
          {eventos.map((evento, index) => (
            <div
              key={index}
              className={`${evento.cor} w-full p-4 rounded-lg flex items-center gap-3 hover:scale-[1.02] transition-transform cursor-pointer`}
            >
              <span className='text-2xl'>{<DateRangeIcon/>}</span>
              <span className='text-neutral-700 font-semibold text-lg'>{evento.nome}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col min-h-screen p-2 sm:p-0'>
      {/* Header de boas-vindas */}
      <div className='flex gap-1 flex-col'>
        <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-neutral-500'>
          Seja muito <strong className='text-neutral-600'>bem-vindo(a)</strong>!
        </h1>
        <p className='text-neutral-400 text-sm sm:text-base'>
          Que o seu dia seja <strong className='uppercase text-neutral-500'>iluminado!</strong>
        </p>
      </div>

      {/* Carrossel */}
      <Carrossel />

      {/* Cards inferiores */}
      <div className='w-full grid grid-cols-1 lg:grid-cols-7 mt-4 gap-4 flex-1 pb-4'>
        {/* Coluna esquerda - Doações e Gastos */}
        <div className='flex flex-col gap-4 lg:col-span-3 order-2 lg:order-1'>
          <Card type="doacoes" />
          <Card type="gastos" />
        </div>

        {/* Coluna direita - Próximos Eventos */}
        <div className='lg:col-span-4 order-1 lg:order-2'>
          <CardEventos />
        </div>
      </div>
    </div>
  )
}
