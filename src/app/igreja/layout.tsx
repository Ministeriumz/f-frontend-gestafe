"use client"
import Navbar from '@/components/siderbar/siderbar';
import React from 'react'
import "../globals.css";
import BtnExit from '@/components/layouts/igreja/btnExit';
import { usePathname } from 'next/navigation';

type LayoutTypes = {
    children: React.ReactNode;
}

export default function layout({ children }: LayoutTypes) {

    const path = usePathname();
    const activeItem = path.split('/')[path.split('/').length - 1];

    const cssClassItemMenu = 'text-base font-normal text-neutral-400 hover:text-neutral-500 transition-all duration-100 cursor-pointer'

    return (
        <div className='flex bg-neutral-100 h-screen w-screen overflow-hidden'>
            <div className='fixed l-0'>
                <Navbar />
            </div>
            <div className='p-4 overflow-auto w-full ml-[300px] text-neutral-600 flex flex-col gap-4'>
                <div className='text-4xl capitalize font-semibold flex flex-col'>
                    {activeItem !== "dashboard" && activeItem}
                    <div className='flex gap-2'>
                        {(path.split('/')).map((item, index) => {
                            if (path.split('/').length <= 3) return null;
                            if (index === 0 || index === 1) return null;
                            if (index === 2) return (
                                <span key={index} className={cssClassItemMenu}>{item} </span>
                            )
                            return (
                                <span key={index} className={cssClassItemMenu}>
                                    {`> ${item}`}
                                </span>
                            )
                        })}
                    </div>
                </div>
                <div className='mt-4 w-full h-full'>
                    {children}
                </div>
            </div>
            <BtnExit />
        </div>
    )
}
