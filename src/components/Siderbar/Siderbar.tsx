"use client"
import Image from 'next/image'
import React from 'react';
import Button from '../button';
import Dashboard from '@mui/icons-material/Dashboard';
import { Item, ItemType } from './Item';
import { useRouter } from 'next/navigation';

//Icones Elementos
import Membros from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import EventIcon from '@mui/icons-material/Event';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const items = {
  escalas: {
    link: '../igreja/escalas',
    nome: 'Escalas',
    icone: <PsychologyIcon />,
  },
  membros: {
    link: '../igreja/membros',
    nome: 'Membros',
    icone: <PeopleAltIcon />,
  },
  financeiro: {
    link: '../igreja/financeiro',
    nome: 'Financeiro',
    icone: <PointOfSaleIcon />,
  },
  eventos: {
    link: '../igreja/eventos',
    nome: 'Eventos',
    icone: <EventIcon />,
  },
  cargos: {
    link: '../igreja/cargos',
    nome: 'Cargos',
    icone: <AccountTreeIcon />,
  },
  mensagens: {
    link: '../igreja/mensagens',
    nome: 'Mensagens',
    icone: <MessageIcon />,
  },
  ministerios: {
    link: '../igreja/ministerios',
    nome: 'Ministerios',
    icone: <AccountBalanceIcon />,
  },
}

const itemsFormated = Object.entries(items);

export default function Navbar() {

  const router = useRouter();



  return (
    <nav className='flex flex-col h-screen w-[300px] p-8 bg-white gap-5 text-textDark items-start relative shadow-lg overflow-x-auto'>
      <div className='w-full h-fit flex items-center justify-center'>
        <Image src={'/gestafebranco.png'} width={100} height={100} alt='logo' className='opacity-30 mt-5 invert' />
      </div>
      <Button icon={<Dashboard />} className='mt-10' onClick={() => router.push('../igreja/dashboard')}>
        Dashboard
      </Button>
      <div className='flex flex-col p-1 text-textLight gap-8 text-start'>
        <div className='flex flex-col gap-3'>
          {itemsFormated.map(([key, item], index) => (<Item key={key} index={index} item={item} />))}
        </div>
      </div>
      <div className='flex gap-3 justify-start absolute bottom-5 left-[20px] text-neutral-600 font-semibold items-center shadow-xl hover:shadow-2xl bg-neutral-200 opacity-80 w-full max-w-[260px] p-3 rounded-xl transition-all hover:bg-neutral-100 cursor-pointer hover:bottom-8'>
        <div className='rounded-full p-3 bg-primary text-white'>
          <PersonIcon />
        </div>
        <h4 className='text-xl'>Usuario</h4>
      </div>
    </nav>
  )
}
