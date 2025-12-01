import React from 'react'
import Carrossel from './carrossel'

export default function page() {

  const Card = () => {
    return (
      <div className='bg-primary/80 w-full min-h-[40px] h-full rounded-md border-2 border-primary shadow-md'>

      </div>
    )
  }

  return (
    <div className='flex flex-col h-screen'>
      <div className='flex gap-1 flex-col'>
        <h1 className='text-4xl font-bold uppercase text-neutral-500'>Seja muito <strong>bem-vindo(a)</strong>!</h1>
        <p className='text-neutral-400'>Que o seu dia seja <strong className='uppercase'>iluminado!</strong></p>
      </div>
      <Carrossel />
      <div className='w-full grid grid-cols-1 md:grid-cols-7 mt-4 gap-4 h-full'>
        <div className='flex flex-col gap-4 h-full col-span-4'>
          <Card />
          <Card />
        </div>
        <div className='flex flex-col gap-4 h-full col-span-3'>
          <Card />
          <Card />
        </div>
      </div>
    </div>
  )
}
