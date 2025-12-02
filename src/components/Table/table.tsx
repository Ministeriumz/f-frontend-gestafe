'use client'
import React, { useState, useMemo } from 'react'
import Input from '../Input'
import Button from '../Button'

export type Column<T> = {
  key: keyof T
  label: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

type Action = {
  name: string
  func: (row: any) => void
  color?: string
}

type TableProps<T> = {
  columns: Column<T>[]
  data: T[]
  columnsSearch: string[]
  actions?: Action[]
}

export default function Table<T extends Record<string, unknown>>({
  columns,
  data,
  columnsSearch,
  actions
}: TableProps<T>) {

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [filters, setFilters] = useState<Record<string, string>>({})

  const addRow = (index: number, checked: boolean) => {
    if (checked) {
      const row = filteredData[index];
      console.log('Selected row data:', row);
      setSelectedRows(prev => new Set(prev).add(index));
    } else {
      setSelectedRows(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      })
    }
  }

  const handleFilterChange = (columnKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }))
    // Limpa seleção quando filtro muda
    setSelectedRows(new Set())
  }

  // Filtro genérico que funciona com múltiplas colunas
  const filteredData = useMemo(() => {
    return data.filter(row => {
      return Object.entries(filters).every(([columnKey, filterValue]) => {
        if (!filterValue || filterValue.trim() === '') return true

        const cellValue = row[columnKey]

        // Converte para string de forma segura
        const stringValue = cellValue === null || cellValue === undefined
          ? ''
          : String(cellValue).toLowerCase()

        const searchTerm = filterValue.toLowerCase().trim()

        // Suporte a múltiplos termos separados por vírgula (OR)
        if (searchTerm.includes(',')) {
          const terms = searchTerm.split(',').map(t => t.trim()).filter(Boolean)
          return terms.some(term => stringValue.includes(term))
        }

        // Suporte a busca por intervalo numérico (ex: "10-50")
        if (searchTerm.includes('-') && !isNaN(Number(cellValue))) {
          const [min, max] = searchTerm.split('-').map(Number)
          const numValue = Number(cellValue)
          if (!isNaN(min) && !isNaN(max)) {
            return numValue >= min && numValue <= max
          }
        }

        // Suporte a operadores de comparação (>, <, >=, <=, =)
        const operatorMatch = searchTerm.match(/^([><=]+)\s*(.+)$/)
        if (operatorMatch && !isNaN(Number(cellValue))) {
          const [, operator, value] = operatorMatch
          const numValue = Number(cellValue)
          const compareValue = Number(value)

          if (!isNaN(compareValue)) {
            switch (operator) {
              case '>': return numValue > compareValue
              case '<': return numValue < compareValue
              case '>=': return numValue >= compareValue
              case '<=': return numValue <= compareValue
              case '=': return numValue === compareValue
            }
          }
        }

        // Busca padrão (contains)
        return stringValue.includes(searchTerm)
      })
    })
  }, [data, filters])

  return (
    <>
      <div className='w-full mb-4 bg-neutral-600 px-4 py-4 rounded-lg text-white'>
        <p className='text-2xl font-semibold uppercase'>Filtrar:</p>
        {/* <p className='text-xs text-neutral-300 mb-2'>
          Dicas: use vírgula para OR (a,b), hífen para intervalo (10-50), ou operadores ({">"}, {"<"}, {">="}, {"<="}, =)
        </p> */}
        <div className='flex flex-wrap gap-2 mt-4'>
          {columnsSearch.map((colKey) => (
            <Input
              key={colKey}
              placeholder={`${colKey}`}
              className='capitalize'
              onChange={(e) => handleFilterChange(colKey, e.target.value)}
            />
          ))}
        </div>
        {Object.values(filters).some(f => f) && (
          <button
            onClick={() => setFilters({})}
            className='mt-2 text-sm underline hover:text-neutral-300'
          >
            Limpar filtros
          </button>
        )}
      </div>
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide max-w-[30px]">Selecionar</th>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide max-w-[30px]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-8 text-center text-neutral-400"
                  >
                    Nenhum dado encontrado
                  </td>
                </tr>
              ) : (
                filteredData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                  >
                    <th className='flex px-4 py-3'>
                      <input type='checkbox' onChange={(check) => addRow(rowIndex, check.target.checked)} />
                    </th>
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className="px-4 py-3 text-sm text-neutral-700"
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : String(row[col.key] ?? '-')
                        }
                      </td>
                    ))}
                    <th className='flex px-4 py-3 !w-fit gap-2'>
                      {actions?.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          className="w-[200px] border pl-2 rounded-md cursor-pointer transition-colors hover:text-white"
                          style={{
                            backgroundColor: 'transparent',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = action.color || '#e5e5e5'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          onClick={() => action.func(row)}
                        >
                          {action.name}
                        </button>
                      ))}
                    </th>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-neutral-50 text-sm text-neutral-500 border-t border-neutral-200">
          {filteredData.length} de {data.length} {data.length === 1 ? 'registro' : 'registros'}
        </div>
      </div>
      {selectedRows.size > 0 && (
        <div className='flex w-full mt-4 bg-neutral-600 rounded-md text-white px-4 py-2'>
          Linhas selecionadas: {selectedRows.size}
        </div>
      )}
    </>
  )
}