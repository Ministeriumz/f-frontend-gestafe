"use client"
import React from 'react'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Button from '../../Button';

export default function BtnExit() {

    const exit = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    return (
        <Button className='fixed top-4 right-4 !w-[100px] !h-[50px]' onClick={() => exit()} icon={<ExitToAppIcon />} >
            Sair
        </Button>
    )
}
