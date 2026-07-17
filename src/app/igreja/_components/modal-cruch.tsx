
//* Libraries imports

//* Libraries imports
import React from 'react'

//* Components imports
import Modal from '@/components/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import LoadingIndicator from '@/components/loadingIndicator'

export type IgrejaForm = {
    nome: string
    cnpj: string
    estado: string
    rua: string
    cep: string
    numero: string
}

type ChurchModalProps = {
    isOpen: boolean
    loading: boolean
    form: IgrejaForm
    onChange: (field: keyof IgrejaForm, value: string) => void
    onSubmit: (e: React.FormEvent) => void
}

export default function ChurchModal({
    isOpen,
    loading,
    form,
    onChange,
    onSubmit,
}: ChurchModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={() => undefined}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-strong">
                        Cadastre sua igreja
                    </h2>

                    <p className="text-sm text-muted">
                        Como este é seu primeiro acesso, finalize o cadastro da
                        igreja para continuar.
                    </p>
                </div>

                <Input
                    placeholder="Nome da Igreja"
                    value={form.nome}
                    onChange={(e) => onChange('nome', e.target.value)}
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                        placeholder="CNPJ"
                        value={form.cnpj}
                        onChange={(e) => onChange('cnpj', e.target.value)}
                        required
                    />

                    <Input
                        placeholder="Estado (UF)"
                        value={form.estado}
                        onChange={(e) => onChange('estado', e.target.value)}
                        required
                    />

                    <Input
                        placeholder="CEP"
                        value={form.cep}
                        onChange={(e) => onChange('cep', e.target.value)}
                        required
                    />

                    <Input
                        placeholder="Número"
                        value={form.numero}
                        onChange={(e) => onChange('numero', e.target.value)}
                        required
                    />
                </div>

                <Input
                    placeholder="Rua"
                    value={form.rua}
                    onChange={(e) => onChange('rua', e.target.value)}
                    required
                />

                <Button type="submit" className="max-w-none">
                    {loading ? <LoadingIndicator /> : 'Cadastrar igreja'}
                </Button>
            </form>
        </Modal>
    )
}
