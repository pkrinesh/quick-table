import * as React from 'react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { DataTable } from './data-table.js'
import type { UseDataTableOptions, UseDataTableReturn, DataTableProps } from './types.js'

export function useDataTable<TData>(
	options: UseDataTableOptions<TData>
): UseDataTableReturn<TData> {
	const { data, columns, ...restOptions } = options

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		...restOptions,
	})

	// Create a stable component that uses this table instance
	const Table = React.useMemo(() => {
		const TableComponent: React.FC<DataTableProps> = (props) => {
			return <DataTable table={table} {...props} />
		}
		TableComponent.displayName = 'DataTable'
		return TableComponent
	}, [table])

	return {
		table,
		Table,
	}
}
