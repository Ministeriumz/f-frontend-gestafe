"use client"
import { useCrud, ApiResponse } from './useCrud'
import { useCallback } from 'react'

// Tipagem do TipoUsuarioDTO conforme documentação
export interface TipoUsuarioDTO {
  id?: number
  nome: string
}

export function useTiposUsuario() {
  const crud = useCrud<TipoUsuarioDTO>('TipoUsuario')

  // PATCH específico para tipo de usuário
  const atualizarParcial = useCallback(async (
    id: number, 
    dados: Partial<TipoUsuarioDTO>
  ): Promise<ApiResponse<TipoUsuarioDTO>> => {
    return crud.patch(id, dados, 'AtualizarTipoUsuarioPorId')
  }, [crud])

  return {
    ...crud,
    atualizarParcial,
  }
}

export default useTiposUsuario
