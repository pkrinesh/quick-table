import * as React from 'react'
import { flexRender } from '@tanstack/react-table'
import { TableRow as UITableRow, TableCell } from '#/components/ui/table.js'
import type { DataTableRowProps } from '../types.js'
import { cn } from '#/lib/utils.js'

export function TableRow<TData>({ row, className, children }: DataTableRowProps<TData>) {
	// If children provided, use them (composition mode)
	if (children) {
		return (
			<UITableRow
				data-state={row.getIsSelected() ? 'selected' : undefined}
				className={className}
			>
				{children}
			</UITableRow>
		)
	}

	// Default rendering
	return (
		<UITableRow
			data-state={row.getIsSelected() ? 'selected' : undefined}
			className={cn(row.index % 2 === 0 && 'bg-accent/50', className)}
		>
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
		</UITableRow>
	)
}
