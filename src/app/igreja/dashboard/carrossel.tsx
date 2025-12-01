import React from 'react'

export default function Carrossel() {

    return (
        <div className='flex gap-2 mt-8 max-h-[600px]'>
            <div className='relative w-[70%] rounded-md overflow-hidden group shadow-md'>
                <div className='bg-black/50 w-full h-full absolute z-10'></div>
                <img src="/dashboard/amigos.jpg" alt="Carrossel Image 1" className='group-hover:scale-110 transition-all' />
            </div>
            <div className='relative w-[30%] rounded-md overflow-hidden group shadow-md'>
                <div className='bg-black/50 w-full h-full absolute z-10'></div>
                <img src="/dashboard/reuniao.jpg" alt="Carrossel Image 1" className='rounded-lg w-full h-full group-hover:scale-110 transition-all' />
            </div>
        </div>
    )
}
