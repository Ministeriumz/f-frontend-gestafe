"use client"
import { useCrud } from './useCrud'

// Tipagem do MinisterioDTO conforme documentação
export interface MinisterioDTO {
  id?: number
  nome: string
  tamanho_max: number
}

export function useMinisterios() {
  const crud = useCrud<MinisterioDTO>('Ministerio')

  return {
    ...crud,
  }
}

export default useMinisterios
