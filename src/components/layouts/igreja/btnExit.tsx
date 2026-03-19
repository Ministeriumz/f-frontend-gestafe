"use client"
import React from 'react'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Button from '../../Button';
import { clearSession } from '@/lib/auth';

export default function BtnExit() {

    const exit = () => {
        clearSession();
        window.location.href = '/';
    }

    return (
        <Button className='fixed bottom-4 right-4 md:top-4 md:bottom-auto !w-[90px] !h-[42px] text-sm z-50' onClick={() => exit()} icon={<ExitToAppIcon fontSize="small" />} >
            Sair
        </Button>
    )
}
