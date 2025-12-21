import * as React from 'react'
import type { Table } from '@tanstack/react-table'
import type { DataTableContextValue } from './types.js'

const DataTableContext = React.createContext<DataTableContextValue | null>(null)

export function useDataTableContext<TData>(): DataTableContextValue<TData> {
	const context = React.useContext(DataTableContext)
	if (!context) {
		throw new Error('useDataTableContext must be used within a DataTableProvider')
	}
	return context as DataTableContextValue<TData>
}

export interface DataTableProviderProps<TData> {
	table: Table<TData>
	children: React.ReactNode
}

export function DataTableProvider<TData>({
	table,
	children,
}: DataTableProviderProps<TData>) {
	const value = React.useMemo(() => ({ table }), [table])

	return (
		<DataTableContext.Provider value={value as DataTableContextValue}>
			{children}
		</DataTableContext.Provider>
	)
}
