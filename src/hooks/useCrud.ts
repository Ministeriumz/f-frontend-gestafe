"use client"
import { useState, useCallback } from 'react'

// Tipagem da resposta padrão da API
export interface ApiResponse<T> {
  code: number
  message: string
  data: T | null
}

// Enum de códigos de resposta
export enum ResponseCode {
  SUCCESS = 1,
  INVALID = 2,
  NOT_FOUND = 3,
  CONFLICT = 4,
  UNAUTHORIZED = 5,
  ERROR = 6,
}

// Configuração base da API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Hook genérico de CRUD
export function useCrud<T extends { id?: number }>(endpoint: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // GET - Listar todos
  const getAll = useCallback(async (): Promise<ApiResponse<T[]>> => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`)
      const result: ApiResponse<T[]> = await response.json()
      
      if (result.code === ResponseCode.SUCCESS && result.data) {
        setData(result.data)
      }
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar dados'
      setError(message)
      return { code: ResponseCode.ERROR, message, data: null }
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  // GET - Buscar por ID
  const getById = useCallback(async (id: number): Promise<ApiResponse<T>> => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}/${id}`)
      const result: ApiResponse<T> = await response.json()
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar item'
      setError(message)
      return { code: ResponseCode.ERROR, message, data: null }
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  // POST - Criar
  const create = useCallback(async (item: Omit<T, 'id'>): Promise<ApiResponse<T>> => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
      const result: ApiResponse<T> = await response.json()
      
      if (result.code === ResponseCode.SUCCESS && result.data) {
        setData(prev => [...prev, result.data as T])
      }
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar item'
      setError(message)
      return { code: ResponseCode.ERROR, message, data: null }
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  // PUT - Atualizar completo
  const update = useCallback(async (item: T): Promise<ApiResponse<T>> => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
      const result: ApiResponse<T> = await response.json()
      
      if (result.code === ResponseCode.SUCCESS && result.data) {
        setData(prev => prev.map(d => 
          (d as T & { id: number }).id === (result.data as T & { id: number }).id 
            ? result.data as T 
            : d
        ))
      }
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar item'
      setError(message)
      return { code: ResponseCode.ERROR, message, data: null }
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  // PATCH - Atualização parcial
  const patch = useCallback(async (id: number, partialItem: Partial<T>, patchEndpoint?: string): Promise<ApiResponse<T>> => {
    setLoading(true)
    setError(null)
    try {
      const url = patchEndpoint 
        ? `${BASE_URL}/${endpoint}/${patchEndpoint}${id}`
        : `${BASE_URL}/${endpoint}/${id}`
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partialItem),
      })
      const result: ApiResponse<T> = await response.json()
      
      if (result.code === ResponseCode.SUCCESS && result.data) {
        setData(prev => prev.map(d => 
          (d as T & { id: number }).id === id ? result.data as T : d
        ))
      }
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar item'
      setError(message)
      return { code: ResponseCode.ERROR, message, data: null }
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  // DELETE - Remover
  const remove = useCallback(async (id: number): Promise<ApiResponse<null>> => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
        method: 'DELETE',
      })
      const result: ApiResponse<null> = await response.json()
      
      if (result.code === ResponseCode.SUCCESS) {
        setData(prev => prev.filter(d => (d as T & { id: number }).id !== id))
      }
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao remover item'
      setError(message)
      return { code: ResponseCode.ERROR, message, data: null }
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  return {
    data,
    setData,
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    patch,
    remove,
  }
}

export default useCrud
