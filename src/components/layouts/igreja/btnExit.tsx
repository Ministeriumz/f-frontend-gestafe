"use client"
//* Libraries imports

//* Libraries imports
import React, { useState } from 'react'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

//* Components imports
import ConfirmDialog from '@/components/dialog';

//* Utilities imports
import { Button } from '@/components/ui/button';
import { clearSession } from '@/lib/auth';

export default function BtnExit() {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const exit = () => {
        clearSession();
        window.location.href = '/';
    }

    return (
        <>
        <Button className='bottom-4 right-4 md:top-4 md:bottom-auto w-[90px] z-50' onClick={() => setConfirmOpen(true)}>
            Sair <ExitToAppIcon fontSize="small" />
        </Button>
        <ConfirmDialog
            isOpen={confirmOpen}
            title="Deseja sair da sua conta?"
            description="Sua sessão atual será encerrada e você voltará para a tela de acesso."
            confirmLabel="Sair da conta"
            onCancel={() => setConfirmOpen(false)}
            onConfirm={exit}
        />
        </>
    )
}
