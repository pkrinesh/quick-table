import { TableHead, TableRow, TableHeader as UITableHeader } from '#/components/ui/table.js'
import { cn } from '#/lib/utils'
import { flexRender } from '@tanstack/react-table'
import { useDataTableContext } from '../data-table-context.js'
import type { DataTableHeaderProps } from '../types.js'

export function TableHeader({ className, children }: DataTableHeaderProps) {
	const { table } = useDataTableContext()

	// If children provided, use them (composition mode)
	if (children) {
		return (
			<UITableHeader className={cn('bg-accent sticky top-0 z-10', className)}>
				{children}
			</UITableHeader>
		)
	}

	// Default rendering
	return (
		<UITableHeader className={cn('bg-muted sticky top-0 z-10', className)}>
			{table.getHeaderGroups().map((headerGroup) => (
				<TableRow key={headerGroup.id}>
					{headerGroup.headers.map((header) => (
						<TableHead key={header.id}>
							{header.isPlaceholder
								? null
								: flexRender(header.column.columnDef.header, header.getContext())}
						</TableHead>
					))}
				</TableRow>
			))}
		</UITableHeader>
	)
}
