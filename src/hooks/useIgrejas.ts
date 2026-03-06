"use client"
import { useCrud, ApiResponse } from './useCrud'
import { useCallback } from 'react'

// Tipagem do IgrejaDTO conforme documentação
export interface IgrejaDTO {
  id?: number
  nome: string
  cnpj: string
  estado: string
  rua: string
  cep: string
  numero: string
}

export function useIgrejas() {
  const crud = useCrud<IgrejaDTO>('Igreja')

  // PATCH específico para igreja
  const atualizarParcial = useCallback(async (
    id: number, 
    dados: Partial<IgrejaDTO>
  ): Promise<ApiResponse<IgrejaDTO>> => {
    return crud.patch(id, dados, 'AtualizarIgrejaPorId')
  }, [crud])

  return {
    ...crud,
    atualizarParcial,
  }
}

export default useIgrejas
