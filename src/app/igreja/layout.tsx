"use client"
import Navbar from '@/components/siderbar/Siderbar';
import React from 'react'
import "../globals.css";
import BtnExit from '@/components/layouts/igreja/btnExit';
import { usePathname, useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { useEffect } from 'react';

type LayoutTypes = {
    children: React.ReactNode;
}

export default function layout({ children }: LayoutTypes) {

    const router = useRouter();
    const path = usePathname();
    const activeItem = path.split('/')[path.split('/').length - 1];

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace('/');
        }
    }, [router]);

    const cssClassItemMenu = 'text-xs md:text-sm font-normal text-neutral-400 hover:text-neutral-500 transition-all duration-100 cursor-pointer'

    return (
        <div className='min-h-screen w-full overflow-x-hidden'>
            <Navbar />
            <div className='w-full md:ml-[250px] md:w-[calc(100%-250px)] pt-[88px] md:pt-4 p-3 md:p-4 text-neutral-600 flex flex-col gap-3'>
                <div className='glass-soft rounded-xl p-3 text-2xl md:text-3xl capitalize font-semibold flex flex-col'>
                    {activeItem !== "dashboard" && activeItem}
                    <div className='flex gap-2 text-xs md:text-sm flex-wrap'>
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
                <div className='mt-2 w-full'>
                    {children}
                </div>
            </div>
            <BtnExit />
        </div>
    )
}
