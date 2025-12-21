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

export interface UseDataTableOptions<TData> extends Omit<TableOptions<TData>, 'getCoreRowModel'> {
	data: TData[]
	columns: ColumnDef<TData, unknown>[]
}

export interface UseDataTableReturn<TData> {
	/** Original TanStack table instance */
	table: Table<TData>
	/** Composed table component */
	Table: DataTableComponent
}

// ============================================================================
// Component Props
// ============================================================================

export interface DataTableProps {
	className?: string
	children?: React.ReactNode
	/** Max height for the table container. Enables scrolling with sticky header. */
	maxHeight?: string
}

export interface DataTableHeaderProps {
	className?: string
	children?: React.ReactNode
}

export interface DataTableHeaderRowProps<TData> {
	headerGroup: HeaderGroup<TData>
	className?: string
	children?: React.ReactNode
}

export interface DataTableHeaderCellProps<TData> {
	header: Header<TData, unknown>
	className?: string
	children?: React.ReactNode
}

export interface DataTableBodyProps {
	className?: string
	children?: React.ReactNode
}

export interface DataTableRowProps<TData> {
	row: Row<TData>
	className?: string
	children?: React.ReactNode
}

export interface DataTableCellProps<TData> {
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

export interface DataTableContextValue<TData = unknown> {
	table: Table<TData>
}
