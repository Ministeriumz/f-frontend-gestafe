"use client"

import React, { useEffect, useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import Navbar from '@/components/siderbar/Siderbar'
import BtnExit from '@/components/layouts/igreja/btnExit'

import { ResponseCode, useIgrejas, useUsuarios } from '@/hooks'
import { getSessionUser, isAuthenticated } from '@/lib/auth'
import ChurchModal from '@/app/igreja/_components/modal-cruch'

// ─── Types ────────────────────────────────────────────────────────────────────

type LayoutProps = {
    children: React.ReactNode
}

type IgrejaForm = {
    nome: string
    cnpj: string
    estado: string
    rua: string
    cep: string
    numero: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_IGREJA_FORM: IgrejaForm = {
    nome: '',
    cnpj: '',
    estado: '',
    rua: '',
    cep: '',
    numero: '',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolve o ID da igreja a partir do resultado da criação ou,
 * como fallback, buscando pelo CNPJ na lista completa.
 */
async function resolveIgrejaId(
    resultId: number | undefined,
    cnpj: string,
    getIgrejas: () => Promise<{ data?: Array<{ id?: number; cnpj?: string }> | null }>
): Promise<number> {
    if (resultId) return resultId

    const lista = await getIgrejas()
    const encontrada = (lista.data ?? [])
        .filter((i) => i.cnpj === cnpj)
        .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))[0]

    return encontrada?.id ?? 0
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function Breadcrumb({ path }: { path: string }) {
    const segments = path.split('/').filter(Boolean)

    // Só exibe breadcrumb a partir do 3º nível (/a/b/c em diante)
    if (segments.length < 3) return null

    return (
        <div className="flex gap-2 text-xs md:text-sm flex-wrap">
            {segments.slice(1).map((segment, index) => (
                <span
                    key={index}
                    className="text-xs md:text-sm font-normal text-foreground/55 hover:text-foreground/75 transition-all duration-100 cursor-pointer"
                >
                    {index > 0 ? `> ${segment}` : segment}
                </span>
            ))}
        </div>
    )
}
// ─── Layout ───────────────────────────────────────────────────────────────────

export default function Layout({ children }: LayoutProps) {
    const router = useRouter()
    const path = usePathname()

    const segments = path.split('/')
    const activeItem = segments[segments.length - 1]

    const { getById, atualizarParcial: atualizarUsuario } = useUsuarios()
    const { create: criarIgreja, getAll: getIgrejas, loading: loadingIgreja } = useIgrejas()

    const [isChurchModalOpen, setIsChurchModalOpen] = useState(false)
    const [checkingChurch, setCheckingChurch] = useState(true)
    const [userId, setUserId] = useState<number | null>(null)
    const [igrejaForm, setIgrejaForm] = useState<IgrejaForm>(INITIAL_IGREJA_FORM)

    // ── Auth + verificação de igreja ──────────────────────────────────────────

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace('/')
            return
        }

        const sessionUser = getSessionUser()
        const currentUserId = Number(sessionUser?.userId)

        if (!currentUserId) {
            setCheckingChurch(false)
            return
        }

        setUserId(currentUserId)

        const verificarIgreja = async () => {
            try {
                const result = await getById(currentUserId)

                if (result.code !== ResponseCode.SUCCESS) {
                    toast.error(result.message ?? 'Não foi possível verificar seu cadastro.')
                    return
                }

                const temIgreja = Boolean(Number(result.data?.idIgreja))
                setIsChurchModalOpen(!temIgreja)
            } catch {
                toast.error('Erro inesperado ao verificar seu cadastro.')
            } finally {
                setCheckingChurch(false)
            }
        }

        void verificarIgreja()
    }, [getById, router])

    // ── Form handlers ─────────────────────────────────────────────────────────

    const handleFormChange = useCallback((field: keyof IgrejaForm, value: string) => {
        setIgrejaForm((prev) => ({ ...prev, [field]: value }))
    }, [])

    const handleCadastrarIgreja = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()

        if (!userId) {
            toast.error('Não foi possível identificar seu usuário.')
            return
        }

        try {
            const result = await criarIgreja(igrejaForm)

            if (result.code !== ResponseCode.SUCCESS) {
                toast.error(result.message ?? 'Erro ao cadastrar igreja.')
                return
            }

            const idIgreja = await resolveIgrejaId(result.data?.id, igrejaForm.cnpj, getIgrejas)

            if (!idIgreja) {
                toast.error('Igreja cadastrada, mas não foi possível obter o ID.')
                return
            }

            const vincular = await atualizarUsuario(userId, { idIgreja })

            if (vincular.code !== ResponseCode.SUCCESS) {
                toast.error(vincular.message ?? 'Igreja criada, mas não foi possível vinculá-la ao usuário.')
                return
            }

            setIsChurchModalOpen(false)
            toast.success('Igreja cadastrada com sucesso.')
        } catch {
            toast.error('Erro inesperado ao cadastrar a igreja.')
        }
    }, [userId, igrejaForm, criarIgreja, getIgrejas, atualizarUsuario])

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen w-full overflow-x-hidden">
            <Navbar />

            <main className="w-full md:ml-[250px] md:w-[calc(100%-250px)] pt-[88px] md:pt-4 p-3 md:p-4 text-neutral-600 flex flex-col gap-3 justify-center">
                <header className="glass-soft rounded-xl p-3 text-xl capitalize font-semibold flex justify-between text-foreground/85">
                    {activeItem !== 'dashboard' && activeItem}
                    <Breadcrumb path={path} />
                    <BtnExit />
                </header>

                <div className="mt-2 w-full text-foreground/85">
                    {children}
                </div>
                
            </main>

            <ChurchModal
                isOpen={isChurchModalOpen && !checkingChurch}
                loading={loadingIgreja}
                form={igrejaForm}
                onChange={handleFormChange}
                onSubmit={handleCadastrarIgreja}
            />
        </div>
    )
}