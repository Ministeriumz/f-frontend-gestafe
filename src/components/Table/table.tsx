'use client'
import React, { useState, useMemo, useEffect } from 'react'
import Input from '../input'
import Modal from '../modal'
import Form, { Camp } from '../Form/form'
import Button from '../Button'
import ImprimirTable from './imprimirTable'

export type Column<T> = {
  key: keyof T
  label: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

export type Action = {
  name: string
  func: (row: any) => void
  color?: string,
  type?: 'create' | 'edit' | 'delete'
}

type TableProps<T> = {
  columns: Column<T>[]
  data: T[]
  columnsSearch: string[]
  actions?: Action[]
  onCreate?: (data: T) => void
  onEdit?: (data: T) => void
  onDelete?: (data: T) => void,
  tipo?: 'create' | 'edit' | 'delete'
  setTipo?: React.Dispatch<React.SetStateAction<'create' | 'edit' | 'delete'>>
  formFields?: Camp[]
}

export default function Table<T extends Record<string, unknown>>({
  columns,
  data,
  columnsSearch,
  actions,
  onCreate,
  onEdit,
  onDelete,
  tipo = 'create',
  setTipo,
  formFields
}: TableProps<T>) {

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRow, setCurrentRow] = useState<T | null>(null)
  const [currentType, setCurrentType] = useState<'create' | 'edit' | 'delete'>(tipo)

  useEffect(() => {
    setCurrentType(tipo)
  }, [tipo])

  // 🧠 NOVO: controle de colunas visíveis
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof T>>(
    () => new Set(columns.map(c => c.key))
  )

  const toggleColumn = (key: keyof T) => {
    setVisibleColumns(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const visibleCols = useMemo(
    () => columns.filter(col => visibleColumns.has(col.key)),
    [columns, visibleColumns]
  )

  const addRow = (index: number, checked: boolean) => {
    if (checked) {
      const row = filteredData[index];
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
    setSelectedRows(new Set())
  }

  const filteredData = useMemo(() => {
    return data.filter(row => {
      return Object.entries(filters).every(([columnKey, filterValue]) => {
        if (!filterValue || filterValue.trim() === '') return true
        const cellValue = row[columnKey]
        const stringValue = cellValue === null || cellValue === undefined
          ? ''
          : String(cellValue).toLowerCase()
        const searchTerm = filterValue.toLowerCase().trim()

        if (searchTerm.includes(',')) {
          const terms = searchTerm.split(',').map(t => t.trim()).filter(Boolean)
          return terms.some(term => stringValue.includes(term))
        }

        if (searchTerm.includes('-') && !isNaN(Number(cellValue))) {
          const [min, max] = searchTerm.split('-').map(Number)
          const numValue = Number(cellValue)
          if (!isNaN(min) && !isNaN(max)) return numValue >= min && numValue <= max
        }

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

        return stringValue.includes(searchTerm)
      })
    })
  }, [data, filters])

  const actionFunc = (action: Action, row: T) => {
    const selectedType = action.type || 'edit'
    setCurrentType(selectedType)
    setTipo?.(selectedType);
    setIsModalOpen(true);
    setCurrentRow(row);
  }

  const ColumnSelector = () => (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* 🎛️ SELETOR DE COLUNAS */}
      <div className="flex flex-col items-center px-3 py-2">
        <span className="text-sm font-medium text-gray-600 text-start w-full">Colunas:</span>
        <div className='flex justify-around gap-5 items-center'>
          {columns.map(col => (
            <label
              key={String(col.key)}
              className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={visibleColumns.has(col.key)}
                onChange={() => toggleColumn(col.key)}
                className="accent-primary"
              />
              {col.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const generatedFields: Camp[] = columns.map((col) => ({
    key: String(col.key),
    placeholder: String(col.label),
  }))

  return (
    <>
      {/* FILTROS + CONTROLE DE COLUNAS */}
      <div className='glass-panel w-full mb-4 rounded-lg p-4 space-y-3'>
        <p className='text-xl font-semibold text-gray-700 uppercase'>Filtrar</p>
        <div className='flex flex-wrap gap-2'>
          {columnsSearch.map((colKey) => (
            <Input
              key={colKey}
              placeholder={`${colKey}`}
              className='capitalize'
              onChange={(e) => handleFilterChange(colKey, e.target.value)}
            />
          ))}
          {onCreate && (
            <Button onClick={() => { setCurrentType('create'); setCurrentRow(null); setIsModalOpen(true); setTipo && setTipo('create') }}>
              Cadastrar
            </Button>
          )}
        </div>

        {Object.values(filters).some(f => f) && (
          <button
            onClick={() => setFilters({})}
            className='text-sm text-blue-600 hover:underline'
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* TABELA */}
      <div className="glass-panel w-full rounded-lg overflow-hidden">
        <div className="overflow-x-auto">

          <table className="w-full border-collapse">
            <thead className="bg-white/40 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium uppercase"></th>
                {visibleCols.map((col) => (
                  <th key={String(col.key)} className="px-4 py-3 text-left text-sm font-medium uppercase">
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-sm font-medium uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={visibleCols.length + 2} className="px-4 py-8 text-center text-gray-400">
                    Nenhum dado encontrado
                  </td>
                </tr>
              ) : (
                filteredData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-white/35 hover:bg-white/30 transition">
                    <td className='px-4 py-3'>
                      <input
                        type='checkbox'
                        onChange={(check) => addRow(rowIndex, check.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
                      />
                    </td>

                    {visibleCols.map((col) => (
                      <td key={String(col.key)} className="px-4 py-3 text-gray-700 text-sm">
                        {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '-')}
                      </td>
                    ))}

                    <td className='px-4 py-3 flex gap-2'>
                      {actions?.map((action, actionIndex) => {
                        if (action.type === 'create') return null;
                        return (
                          <button
                            key={actionIndex}
                            className="px-2 py-1 text-sm font-medium rounded border hover:text-white transition backdrop-blur-sm"
                            style={{ backgroundColor: 'transparent', borderColor: action.color || '#ccc' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = action.color || '#ccc'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            onClick={() => actionFunc(action, row)}
                          >
                            {action.name}
                          </button>
                        )
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className='flex justify-between'>
          <div className="px-4 py-3 text-sm text-gray-500">
            {filteredData.length} de {data.length} {data.length === 1 ? 'registro' : 'registros'}
          </div>
          <ColumnSelector />
        </div>
        <div className='w-full p-4'>
          <ImprimirTable columns={columns} data={filteredData} fileName="relatorio_tabela" />
        </div>
      </div>

      {selectedRows.size > 0 && (
        <div className='flex w-full mt-4 bg-blue-50 rounded-md text-blue-700 px-4 py-2'>
          Linhas selecionadas: {selectedRows.size}
        </div>
      )}


      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Form
          type={currentType}
          object={currentRow as T}
          camps={formFields || generatedFields}
          onCancel={() => setIsModalOpen(false)}
          onConfirm={(data) => onCreate && onCreate(data)}
          onEdit={(data) => onEdit && onEdit(data)}
          onDelete={(data) => onDelete && onDelete(data)}
        />
      </Modal>
    </>
  )
}
