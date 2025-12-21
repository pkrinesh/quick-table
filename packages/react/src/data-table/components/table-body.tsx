import * as React from 'react'
import { flexRender } from '@tanstack/react-table'
import { TableBody as UITableBody, TableRow, TableCell } from '#/components/ui/table.js'
import { useDataTableContext } from '../data-table-context.js'
import type { DataTableBodyProps } from '../types.js'
import { cn } from '#/lib/utils.js'

export function TableBody({ className, children }: DataTableBodyProps) {
	const { table } = useDataTableContext()

	// If children provided, use them (composition mode)
	if (children) {
		return <UITableBody className={className}>{children}</UITableBody>
	}

	const rows = table.getRowModel().rows

	// Default rendering
	return (
		<UITableBody className={className}>
			{rows.length > 0 ? (
				rows.map((row) => (
					<TableRow
						key={row.id}
						data-state={row.getIsSelected() ? 'selected' : undefined}
						className={cn(row.index % 2 === 0 && 'bg-accent/50')}
					>
						{row.getVisibleCells().map((cell) => (
							<TableCell key={cell.id}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</TableCell>
						))}
					</TableRow>
				))
			) : (
				<TableRow>
					<TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
						No results.
					</TableCell>
				</TableRow>
			)}
		</UITableBody>
	)
}
