"use client"
import { useCrud, ApiResponse } from './useCrud'
import { useCallback } from 'react'

// Tipagem do UsuarioDTO conforme documentação
export interface UsuarioDTO {
  id?: number
  nome: string
  sobrenome: string
  telefone: string
  email: string
  senha?: string
  idIgreja: number
  idTipoUsuario: number
}

export function useUsuarios() {
  const crud = useCrud<UsuarioDTO>('Usuario')

  // PATCH específico para usuário
  const atualizarParcial = useCallback(async (
    id: number, 
    dados: Partial<UsuarioDTO>
  ): Promise<ApiResponse<UsuarioDTO>> => {
    return crud.patch(id, dados, 'AtualizarUsuarioPorId')
  }, [crud])

  return {
    ...crud,
    atualizarParcial,
  }
}

export default useUsuarios
