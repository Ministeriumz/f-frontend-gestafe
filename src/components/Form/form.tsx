"use client"
import React, { useState, useEffect } from 'react'
import Button from '../button'
import Input from '../Input'
import Image from 'next/image';

export type Camp = {
    key: string;
    type?: string;
    placeholder: string;
}

type FormProps = {
    camps?: Camp[];
    object?: any;
    type?: string;
    onCancel?: () => void;
    onConfirm?: (data: any) => void;
    onEdit?: (data: any) => void;
    onDelete?: (data: any) => void;
}

export default function Form({
    camps, object, type, onCancel, onConfirm, onEdit, onDelete }: FormProps) {
    const [formData, setFormData] = useState<any>(object || {});
    const [isLoading, setIsLoading] = useState(false);

    // Atualiza formData quando object muda
    useEffect(() => {
        setFormData(object || {});
    }, [object, type]);

    const tipagem = object ? Object.keys(object) : camps;

    const contagem = tipagem?.length || 0;
    const tipoColunas = contagem <= 4 ? 'grid-cols-1' : contagem <= 8 ? 'grid-cols-2' : 'grid-cols-3';

    const tipos: { [key: string]: string } = {
        edit: 'edit',
        delete: 'delete',
        create: 'create'
    }

    const handleSubmit = async (e: React.FormEvent) => {
        console.log(formData);
        e.preventDefault();
        if (!onConfirm) return;
        console.log(type);
        setIsLoading(true);
        try {
            if (type === 'edit' && onEdit) {
                await onEdit(formData);
                return;
            }
            if (type === 'delete' && onDelete) {
                await onDelete(formData);
                return;
            } else {
                await onConfirm(formData);
            }
        } catch (error) {
            console.error('Erro no formulário:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    // Filtra campos que não devem aparecer no formulário
    const fieldsToHide = ['id', 'idsecretaria', 'idfornecedor', 'idorcamento'];

    const normalizedFields: Camp[] = object
        ? Object.keys(object).map(key => ({ key, placeholder: key }))
        : camps || [];

    const visibleFields = normalizedFields.filter(
        (field) => !fieldsToHide.includes(field.key.toLowerCase())
    );

    const nomes: { [key: string]: string } = {
        create: 'Criar',
        edit: 'Editar',
        delete: 'Excluir',
    }

    return (
        <form className='flex flex-col' onSubmit={handleSubmit}>
            <div className='flex flex-col'>
                <h1 className='text-2xl font-semibold capitalize'>{nomes[type ? type : 'create']}</h1>
                <p className='text-gray-400'>Vamos lá, preencha os campos abaixo:</p>
            </div>
            <div className='flex'>
                <div className={`grid ${tipoColunas} gap-2 mt-4`}>
                    {visibleFields?.map((field: Camp, index: number) => (
                        <Input
                            key={field.key + index}
                            placeholder={field.placeholder}
                            required={type !== 'view'}
                            disabled={type === 'view' || type === 'delete'}
                            value={formData[field.key] || ''}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                        />
                    ))}
                </div>
            </div>

            <div className='mt-4 gap-2 grid grid-cols-1 md:grid-cols-2'>
                <Button className='!w-full' onClick={onCancel}>
                    Cancelar
                </Button>
                {type !== 'view' ? (
                    <Button
                        className='!w-full'
                    >
                        {isLoading ? 'Processando...' : 'Confirmar'}
                    </Button>
                ) : <div></div>}
            </div>
        </form>
    )
}
