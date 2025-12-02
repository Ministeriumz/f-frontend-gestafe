import React from 'react'

export default function Carrossel() {

    return (
        <div className='flex flex-col sm:flex-row gap-2 mt-4 sm:mt-8 max-h-[300px] sm:max-h-[400px] lg:max-h-[500px]'>
            <div className='relative w-full sm:w-[70%] h-[180px] sm:h-auto rounded-lg overflow-hidden group shadow-md'>
                <div className='bg-black/40 w-full h-full absolute z-10'></div>
                <img 
                    src="/dashboard/amigos.jpg" 
                    alt="Carrossel Image 1" 
                    className='w-full h-full object-cover group-hover:scale-110 transition-all duration-300' 
                />
            </div>
            <div className='relative w-full sm:w-[30%] h-[120px] sm:h-auto rounded-lg overflow-hidden group shadow-md'>
                <div className='bg-black/40 w-full h-full absolute z-10'></div>
                <img 
                    src="/dashboard/reuniao.jpg" 
                    alt="Carrossel Image 2" 
                    className='w-full h-full object-cover group-hover:scale-110 transition-all duration-300' 
                />
            </div>
        </div>
    )
}
