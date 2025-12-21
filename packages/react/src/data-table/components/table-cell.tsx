import * as React from 'react'
import { flexRender } from '@tanstack/react-table'
import { TableCell as UITableCell } from '#/components/ui/table.js'
import type { DataTableCellProps } from '../types.js'

export function TableCell<TData>({ cell, className, children }: DataTableCellProps<TData>) {
	return (
		<UITableCell className={className}>
			{children ?? flexRender(cell.column.columnDef.cell, cell.getContext())}
		</UITableCell>
	)
}
