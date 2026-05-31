"use client"
import Navbar from '@/components/siderbar/Siderbar';
import React, { useEffect, useState } from 'react'
import BtnExit from '@/components/layouts/igreja/btnExit';
import { usePathname, useRouter } from 'next/navigation';
import { getSessionUser, isAuthenticated } from '@/lib/auth';
import Modal from '@/components/modal';
import Input from '@/components/input';
import Button from '@/components/button';
import LoadingIndicator from '@/components/loadingIndicator';
import { ResponseCode, useIgrejas, useUsuarios } from '@/hooks';
import { toast } from 'sonner';

type LayoutTypes = {
    children: React.ReactNode;
}

export default function layout({ children }: LayoutTypes) {

    const router = useRouter();
    const path = usePathname();
    const activeItem = path.split('/')[path.split('/').length - 1];
    const { getById, atualizarParcial: atualizarUsuario } = useUsuarios();
    const { create: criarIgreja, getAll: getIgrejas, loading: loadingIgreja } = useIgrejas();

    const [isChurchModalOpen, setIsChurchModalOpen] = useState(false);
    const [checkingChurch, setCheckingChurch] = useState(true);
    const [userId, setUserId] = useState<number | null>(null);
    const [igrejaForm, setIgrejaForm] = useState({
        nome: '',
        cnpj: '',
        estado: '',
        rua: '',
        cep: '',
        numero: '',
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace('/');
            return;
        }

        const sessionUser = getSessionUser();
        if (!sessionUser.userId) {
            setCheckingChurch(false);
            return;
        }

        const currentUserId = Number(sessionUser.userId);
        setUserId(currentUserId);

        const carregarUsuario = async () => {
            const result = await getById(currentUserId);
            if (result.code === ResponseCode.SUCCESS) {
                const igrejaVinculada = Number(result.data?.idIgreja || 0);
                setIsChurchModalOpen(!igrejaVinculada);
            } else {
                toast.error(result.message || 'Nao foi possivel verificar seu cadastro.');
            }

            setCheckingChurch(false);
        };

        void carregarUsuario();
    }, [getById, router]);

    const cadastrarIgreja = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!userId) {
            toast.error('Nao foi possivel identificar seu usuario.');
            return;
        }

        const result = await criarIgreja(igrejaForm);
        if (result.code !== ResponseCode.SUCCESS) {
            toast.error(result.message || 'Erro ao cadastrar igreja');
            return;
        }

        let idIgreja = result.data?.id || 0;

        if (!idIgreja) {
            const lista = await getIgrejas();
            const encontrada = (lista.data || [])
                .filter((igreja) => igreja.cnpj === igrejaForm.cnpj)
                .sort((a, b) => (b.id || 0) - (a.id || 0))[0];
            idIgreja = encontrada?.id || 0;
        }

        if (!idIgreja) {
            toast.error('Igreja cadastrada, mas nao foi possivel obter o ID.');
            return;
        }

        const vincularUsuario = await atualizarUsuario(userId, { idIgreja });
        if (vincularUsuario.code !== ResponseCode.SUCCESS) {
            toast.error(vincularUsuario.message || 'Igreja criada, mas nao foi possivel vincular ao usuario.');
            return;
        }

        setIsChurchModalOpen(false);
        setCheckingChurch(false);
        toast.success('Igreja cadastrada com sucesso.');
    };

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
            <Modal isOpen={isChurchModalOpen && !checkingChurch} onClose={() => undefined}>
                <form onSubmit={cadastrarIgreja} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-semibold text-neutral-800">Cadastre sua igreja</h2>
                        <p className="text-sm text-neutral-500">Como este e seu primeiro acesso, finalize o cadastro da igreja para continuar.</p>
                    </div>

                    <Input placeholder="Nome da Igreja" value={igrejaForm.nome} onChange={(e) => setIgrejaForm({ ...igrejaForm, nome: e.target.value })} required />
                    <Input placeholder="CNPJ" value={igrejaForm.cnpj} onChange={(e) => setIgrejaForm({ ...igrejaForm, cnpj: e.target.value })} required />
                    <Input placeholder="Estado (UF)" value={igrejaForm.estado} onChange={(e) => setIgrejaForm({ ...igrejaForm, estado: e.target.value })} required />
                    <Input placeholder="Rua" value={igrejaForm.rua} onChange={(e) => setIgrejaForm({ ...igrejaForm, rua: e.target.value })} required />
                    <Input placeholder="CEP" value={igrejaForm.cep} onChange={(e) => setIgrejaForm({ ...igrejaForm, cep: e.target.value })} required />
                    <Input placeholder="Numero" value={igrejaForm.numero} onChange={(e) => setIgrejaForm({ ...igrejaForm, numero: e.target.value })} required />

                    <Button type="submit" className="max-w-none">
                        {loadingIgreja ? <LoadingIndicator /> : 'Cadastrar igreja'}
                    </Button>
                </form>
            </Modal>
        </div>
    )
}
