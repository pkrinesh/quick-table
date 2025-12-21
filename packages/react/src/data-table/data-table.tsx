import * as React from 'react'
import { TableBody } from './components/table-body.js'
import { TableHeader } from './components/table-header.js'
import { DataTableProvider } from './data-table-context.js'
import type { DataTableProps } from './types.js'
import type { Table as TableType } from '@tanstack/react-table'
import { Table as UITable } from '#/components/ui/table.js'
import { cn } from '#/lib/utils.js'

interface InternalDataTableProps<TData> extends DataTableProps {
	table: TableType<TData>
}

export function DataTable<TData>({
	table,
	className,
	children,
	maxHeight,
}: InternalDataTableProps<TData>) {
	const hasChildren = React.Children.count(children) > 0

	const containerStyle = maxHeight ? { maxHeight } : undefined

	return (
		<DataTableProvider table={table}>
			{hasChildren ? (
				// Composition mode - render children as-is
				<div className={cn('relative w-full overflow-auto', className)} style={containerStyle}>
					{children}
				</div>
			) : (
				// Static mode - render default structure
				<div className={cn('relative w-full overflow-auto', className)} style={containerStyle}>
					<UITable>
						<TableHeader />
						<TableBody />
					</UITable>
				</div>
			)}
		</DataTableProvider>
	)
}
