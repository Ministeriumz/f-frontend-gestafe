"use client"
import { useCrud } from './useCrud'

// Tipagem do EventosDTO conforme documentação
export interface EventoDTO {
  id?: number
  nome: string
  tipo: string
  resumo: string
  data: string // formato: yyyy-MM-dd
  hora_inicio: string // formato: HH:mm:ss
  hora_fim: string // formato: HH:mm:ss
}

export function useEventos() {
  const crud = useCrud<EventoDTO>('Eventos')

  return {
    ...crud,
    // Funções específicas podem ser adicionadas aqui
  }
}

export default useEventos
