import type {
	ColumnDef,
	Row,
	Cell,
	Header,
	HeaderGroup,
	Table,
	TableOptions,
} from '@tanstack/react-table'

// ============================================================================
// Hook Options & Return
// ============================================================================

export type UseDataTableOptions<TData> = Omit<TableOptions<TData>, 'getCoreRowModel'> & {
	data: TData[]
	columns: ColumnDef<TData>[]
}

export type UseDataTableReturn<TData> = {
	/** Original TanStack table instance */
	table: Table<TData>
	/** Composed table component */
	Table: DataTableComponent
}

// ============================================================================
// Component Props
// ============================================================================

export type DataTableProps = {
	className?: string
	children?: React.ReactNode
	/** Max height for the table container. Enables scrolling with sticky header. */
	maxHeight?: string
}

export type DataTableHeaderProps = {
	className?: string
	children?: React.ReactNode
}

export type DataTableHeaderRowProps<TData> = {
	headerGroup: HeaderGroup<TData>
	className?: string
	children?: React.ReactNode
}

export type DataTableHeaderCellProps<TData> = {
	header: Header<TData, unknown>
	className?: string
	children?: React.ReactNode
}

export type DataTableBodyProps = {
	className?: string
	children?: React.ReactNode
}

export type DataTableRowProps<TData> = {
	row: Row<TData>
	className?: string
	children?: React.ReactNode
}

export type DataTableCellProps<TData> = {
	cell: Cell<TData, unknown>
	className?: string
	children?: React.ReactNode
}

// ============================================================================
// Component Types
// ============================================================================

export type DataTableComponent = React.FC<DataTableProps>

// ============================================================================
// Context
// ============================================================================

export type DataTableContextValue<TData = unknown> =  {
	table: Table<TData>
}
