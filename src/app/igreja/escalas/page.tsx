"use client";

import React, { useState } from 'react';
import Image from 'next/image';

// Dados de exemplo para dias de culto
const diasDeCulto = [
  { dia: 12, mes: 'JANEIRO', selecionado: true },
  { dia: 16, mes: 'JANEIRO', selecionado: false },
  { dia: 17, mes: 'JANEIRO', selecionado: false },
  { dia: 20, mes: 'JANEIRO', selecionado: false },
];

// Dados de exemplo para escalas
const escalasData = [
  {
    id: 1,
    nome: 'RAFAELA RAMOS',
    cargo: 'Auxiliar',
    foto: '/dashboard/avatar1.jpg',
    horarioInicio: '12:00',
    horarioFim: '22:00',
  },
  {
    id: 2,
    nome: 'JOÃO SILVA',
    cargo: 'Líder de Louvor',
    foto: '/dashboard/avatar2.jpg',
    horarioInicio: '08:00',
    horarioFim: '12:00',
  },
  {
    id: 3,
    nome: 'MARIA SANTOS',
    cargo: 'Recepcionista',
    foto: '/dashboard/avatar3.jpg',
    horarioInicio: '10:00',
    horarioFim: '14:00',
  },
  {
    id: 4,
    nome: 'PEDRO OLIVEIRA',
    cargo: 'Auxiliar',
    foto: '/dashboard/avatar4.jpg',
    horarioInicio: '14:00',
    horarioFim: '18:00',
  },
];

// Componente para o badge de dia
interface DiaBadgeProps {
  dia: number;
  mes: string;
  selecionado: boolean;
  onClick: () => void;
}

function DiaBadge({ dia, mes, selecionado, onClick }: DiaBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 transition-all ${
        selecionado
          ? 'bg-[#82ACAA] border-[#82ACAA] text-white'
          : 'bg-white border-gray-300 text-gray-700 hover:border-[#82ACAA]'
      }`}
    >
      <span className="text-xl font-bold leading-none">{dia}</span>
      <span className="text-[8px] font-medium leading-none mt-1">{mes}</span>
    </button>
  );
}

// Componente para o botão de adicionar dia
function AddDiaButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-10 h-10 text-4xl text-gray-400 hover:text-[#82ACAA] transition-colors"
    >
      +
    </button>
  );
}

// Componente para card de escala
interface EscalaCardProps {
  nome: string;
  cargo: string;
  foto: string;
  horarioInicio: string;
  horarioFim: string;
}

function EscalaCard({ nome, cargo, foto, horarioInicio, horarioFim }: EscalaCardProps) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-[#82ACAA] to-[#4a6b4f] flex items-center justify-center text-white text-xl font-bold">
            {nome.charAt(0)}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{nome}</h3>
          <p className="text-sm text-gray-500">{cargo}</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-2xl font-light text-gray-700">
          {horarioInicio} - {horarioFim}
        </span>
      </div>
    </div>
  );
}

// Componente para botão de adicionar escala
function AddEscalaButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 bg-[#82ACAA] hover:bg-[#337D7A] text-white font-semibold py-3 px-8 rounded-lg transition-colors mt-4"
    >
      Adicionar Escala
      <span className="text-xl">+</span>
    </button>
  );
}

export default function EscalasPage() {
  const [dias, setDias] = useState(diasDeCulto);
  const [diaSelecionado, setDiaSelecionado] = useState(0);

  const handleSelectDia = (index: number) => {
    setDiaSelecionado(index);
    setDias(dias.map((dia, i) => ({ ...dia, selecionado: i === index })));
  };

  const handleAddDia = () => {
    alert('Adicionar novo dia de culto');
  };

  const handleAddEscala = () => {
    alert('Adicionar nova escala');
  };

  return (
    <div className="p-8 min-h-screen">

      {/* Dias de Culto */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-600 mb-4">DIAS DE CULTO</h2>
        <div className="flex items-center gap-3 flex-wrap">
          {dias.map((dia, index) => (
            <DiaBadge
              key={index}
              dia={dia.dia} 
              mes={dia.mes}
              selecionado={dia.selecionado}
              onClick={() => handleSelectDia(index)}
            />
          ))}
          <AddDiaButton onClick={handleAddDia} />
        </div>
      </div>

      {/* Lista de Escalas */}
      <div className="max-w-3xl">
        {escalasData.map((escala) => (
          <EscalaCard
            key={escala.id}
            nome={escala.nome}
            cargo={escala.cargo}
            foto={escala.foto}
            horarioInicio={escala.horarioInicio}
            horarioFim={escala.horarioFim}
          />
        ))}

        {/* Botão Adicionar Escala */}
        <div className="flex justify-center">
          <AddEscalaButton onClick={handleAddEscala} />
        </div>
      </div>
    </div>
  );
}
