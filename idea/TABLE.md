# Data Table Library Design

> A TanStack Table wrapper that provides **progressive disclosure of
> complexity**. Start simple, customize as needed. Inspired by
> material-react-table but with easier customization.

---

## Name idea

| Name         | Description          |
| ------------ | -------------------- |
| better-table | Fast, easy           |
| better-grid  | Fast, easy           |
| easy-table   | Fast, easy           |
| swift-table  | Fast, easy           |
| smart-table  | Intelligent defaults |
| quick-table  | Quick to set up      |
| clean-table  | Clean API            |
| sleek-table  | Sleek, minimal       |
| slim-table   | Lightweight          |
| snap-table   | Snap to create       |
| neat-table   | Neat and tidy        |
| flex-table   | Flexible             |
| lite-table   | Lightweight          |

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Core Philosophy](#core-philosophy)
3. [The Hook API](#the-hook-api)
4. [7 Levels of Control](#7-levels-of-control)
5. [Static vs Composition Detection](#static-vs-composition-detection)
6. [Global Config (Project-wide Theming)](#global-config-project-wide-theming)
7. [Component Props & Types](#component-props--types)
8. [Styling API](#styling-api)
9. [Subcomponents Reference](#subcomponents-reference)
10. [File Structure](#file-structure)
11. [Implementation Examples](#implementation-examples)
12. [Migration Guide](#migration-guide)

---

## Problem Statement

### Current Issues with Table Implementation

1. **Duplicated Table Logic**
   - Every table re-implements `useReactTable` boilerplate
   - State management (sorting, filtering) repeated everywhere

2. **Inconsistent Feature Support**
   - `DataTable` component is too simple
   - No built-in support for: row pinning, sorting UI, filtering UI, footer
     rendering
   - Each table implements these features separately

3. **Column Definition Scattered**
   - Common patterns duplicated everywhere:
     - Right-aligned numeric cells
     - Date formatting
     - Null value handling (`v != null ? v.toFixed(4) : '-'`)
     - Currency formatting

4. **Styling Inconsistencies**
   - Different `bg-accent/40` vs `bg-accent/60`
   - Different `max-h-[300px]` vs `max-h-[350px]` vs `max-h-[400px]`
   - Pinned row styles vary between tables

5. **No Composition Pattern**
   - Can't easily add toolbar, pagination, column visibility
   - No escape hatch for custom rendering

6. **Hard to Theme**
   - material-react-table is solid but hard to customize design
   - We need shadcn-style ownership of components

---

## Core Philosophy

1. **Sensible defaults** - Works out of the box with minimal config
2. **Escape hatches at every level** - Override any part without fighting the
   library
3. **Composition over configuration** - Use components when config gets complex
4. **Shadcn-style** - Unstyled primitives with default styles you own
5. **Progressive disclosure** - Simple things simple, complex things possible

---

## The Hook API

### Basic Usage

```typescript
import { useDataTable } from '@/components/data-table'

const { table, Table } = useDataTable({
  data,
  columns,
})

return <Table />
```

### Full Options

```typescript
interface UseDataTableOptions<TData> {
  // Required
  data: TData[]
  columns: ColumnDef<TData>[]

  // Feature flags (all optional, disabled by default)
  enableSorting?: boolean
  enableFiltering?: boolean
  enableColumnFiltering?: boolean
  enableGlobalFiltering?: boolean
  enablePinning?: boolean
  enableRowPinning?: boolean
  enableColumnPinning?: boolean
  enablePagination?: boolean
  enableRowSelection?: boolean
  enableMultiRowSelection?: boolean
  enableColumnVisibility?: boolean
  enableColumnResizing?: boolean

  // Feature configs (when enabled)
  sorting?: {
    initial?: SortingState
    state?: SortingState                    // controlled
    onSortingChange?: OnChangeFn<SortingState>
  }
  filtering?: {
    global?: string
    column?: ColumnFiltersState
    onGlobalFilterChange?: OnChangeFn<string>
    onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  }
  pinning?: {
    top?: TData[] | string[]                // data or row IDs
    bottom?: TData[] | string[]
  }
  pagination?: {
    pageIndex?: number
    pageSize?: number
    pageSizeOptions?: number[]
    onPaginationChange?: OnChangeFn<PaginationState>
  }

  // Styling
  variant?: 'default' | 'accent' | 'bordered' | 'minimal'
  classNames?: DataTableClassNames<TData>

  // Slots (alternative to composition)
  slots?: {
    toolbar?: React.ReactNode
    empty?: React.ReactNode
    loading?: React.ReactNode
    footer?: React.ReactNode
  }

  // Per-instance component overrides
  components?: Partial<DataTableComponents<TData>>

  // All original useReactTable options still work
  ...tanstackOptions
}
```

### Return Value

```typescript
interface UseDataTableReturn<TData> {
	// Original table instance (full TanStack access)
	table: Table<TData>;

	// Composed component with subcomponents
	Table: DataTableComponent<TData>;

	// State helpers (for convenience)
	sorting: SortingState;
	setSorting: OnChangeFn<SortingState>;
	columnFilters: ColumnFiltersState;
	setColumnFilters: OnChangeFn<ColumnFiltersState>;
	globalFilter: string;
	setGlobalFilter: OnChangeFn<string>;
	rowSelection: RowSelectionState;
	setRowSelection: OnChangeFn<RowSelectionState>;
	pagination: PaginationState;
	setPagination: OnChangeFn<PaginationState>;
}
```

---

## 7 Levels of Control

### Level 1: Static (Zero Config)

Just render with defaults.

```typescript
const { table, Table } = useDataTable({ data, columns })

return <Table />
```

### Level 2: Props-based Customization

Minor tweaks via props.

```typescript
return (
  <Table
    maxHeight="350px"
    stickyHeader
    stickyFooter
    showToolbar
    showPagination
  />
)
```

### Level 3: Slots

Inject content into predefined locations.

```typescript
return (
  <Table
    maxHeight="350px"
    toolbar={<BandFilter column={table.getColumn('band')} />}
    footer={<ExportButton />}
    empty={<NoDataMessage />}
  />
)
```

### Level 4: Partial Composition

Override only what you need, use defaults for the rest.

```typescript
return (
  <Table maxHeight="350px">
    <Table.Toolbar>
      <BandFilter column={table.getColumn('band')} />
      <Spacer />
      <Table.ColumnVisibility />
    </Table.Toolbar>
    <Table.Main /> {/* Renders Header + Body + PinnedRows with defaults */}
    <Table.Pagination />
  </Table>
)
```

### Level 5: Full Composition

Complete control over structure.

```typescript
return (
  <Table>
    <Table.Toolbar>
      <BandFilter column={table.getColumn('band')} />
    </Table.Toolbar>
    <Table.Container maxHeight="350px">
      <Table.Header>
        {table.getHeaderGroups().map(headerGroup => (
          <Table.HeaderRow key={headerGroup.id} headerGroup={headerGroup}>
            {headerGroup.headers.map(header => (
              <Table.HeaderCell key={header.id} header={header} />
            ))}
          </Table.HeaderRow>
        ))}
      </Table.Header>
      <Table.Body>
        {table.getCenterRows().map(row => (
          <Table.Row key={row.id} row={row}>
            {row.getVisibleCells().map(cell => (
              <Table.Cell key={cell.id} cell={cell} />
            ))}
          </Table.Row>
        ))}
      </Table.Body>
      <Table.PinnedRows position="bottom">
        {table.getBottomRows().map(row => (
          <Table.Row key={row.id} row={row} pinned />
        ))}
      </Table.PinnedRows>
    </Table.Container>
  </Table>
)
```

### Level 6: Per-instance Component Overrides

Custom component for just this table.

```typescript
const { table, Table } = useDataTable({
  data,
  columns,
  components: {
    Row: MySpecialRow,
    Cell: MySpecialCell,
  },
})

return <Table />
```

### Level 7: Global Config (Project-wide)

Define once, use everywhere. Full control over all tables in the project.

```typescript
// data-table.config.ts
export const dataTableConfig = defineDataTableConfig({
	components: {
		Root: MyTableRoot,
		Row: MyTableRow,
		Cell: MyTableCell,
		// ... all components
	},
	defaults: {
		stickyHeader: true,
		maxHeight: "400px",
	},
	classNames: {
		root: "rounded-xl border",
		row: "hover:bg-accent/50",
	},
});
```

---

## Static vs Composition Detection

The `<Table>` component automatically detects which mode to use:

```typescript
function Table({ children, ...props }) {
  const hasChildren = React.Children.count(children) > 0

  if (hasChildren) {
    // Composition mode - render children as-is
    return (
      <TableContext.Provider value={context}>
        <div className={cn('table-root', props.className)}>
          {children}
        </div>
      </TableContext.Provider>
    )
  }

  // Static mode - render default structure
  return (
    <TableContext.Provider value={context}>
      <div className={cn('table-root', props.className)}>
        {props.toolbar && <Table.Toolbar>{props.toolbar}</Table.Toolbar>}
        <Table.Container maxHeight={props.maxHeight}>
          <Table.Main />
        </Table.Container>
        {props.showPagination && <Table.Pagination />}
        {props.footer}
      </div>
    </TableContext.Provider>
  )
}
```

### Examples

```typescript
// No children = static mode
<Table />
<Table maxHeight="350px" toolbar={<Filter />} />

// Has children = composition mode
<Table>
  <Table.Toolbar>...</Table.Toolbar>
  <Table.Main />
</Table>
```

---

## Global Config (Project-wide Theming)

### Config File

```typescript
// data-table.config.ts
import { defineDataTableConfig } from "@/components/data-table";

import {
	TableRoot,
	TableContainer,
	TableHeader,
	TableHeaderRow,
	TableHeaderCell,
	TableBody,
	TableRow,
	TableCell,
	TableFooter,
	TablePinnedRows,
	TableToolbar,
	TablePagination,
	TableEmpty,
} from "./my-table-components";

export const dataTableConfig = defineDataTableConfig({
	// Component overrides
	components: {
		Root: TableRoot,
		Container: TableContainer,
		Header: TableHeader,
		HeaderRow: TableHeaderRow,
		HeaderCell: TableHeaderCell,
		Body: TableBody,
		Row: TableRow,
		Cell: TableCell,
		Footer: TableFooter,
		PinnedRows: TablePinnedRows,
		Toolbar: TableToolbar,
		Pagination: TablePagination,
		Empty: TableEmpty,
	},

	// Default props for all tables
	defaults: {
		stickyHeader: true,
		stickyFooter: true,
		maxHeight: "400px",
		variant: "bordered",
	},

	// Default classNames
	classNames: {
		root: "rounded-xl border shadow-sm",
		header: "bg-muted/50",
		headerCell: "font-semibold text-muted-foreground",
		row: "hover:bg-accent/50",
		rowEven: "bg-accent/30",
		rowPinned: "bg-info/20 font-bold",
		rowSelected: "bg-primary/10",
		cell: "py-3 px-4",
	},
});
```

### Provider Setup

```typescript
// app/providers.tsx or app/layout.tsx
import { DataTableProvider } from '@/components/data-table'
import { dataTableConfig } from '@/data-table.config'

export function Providers({ children }) {
  return (
    <DataTableProvider config={dataTableConfig}>
      {children}
    </DataTableProvider>
  )
}
```

### Custom Components Example

```typescript
// components/my-table-components.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'
import { flexRender } from '@tanstack/react-table'
import { ChevronUp, ChevronDown } from 'lucide-react'
import type {
  DataTableRowProps,
  DataTableCellProps,
  DataTableHeaderCellProps,
} from '@/components/data-table'

export function TableRow({
  row,
  children,
  className,
  pinned,
  ...props
}: DataTableRowProps) {
  return (
    <tr
      className={cn(
        'border-b transition-colors',
        row.getIsSelected() && 'bg-primary/10',
        pinned && 'bg-info/20 font-semibold',
        !pinned && 'hover:bg-accent/50',
        !pinned && row.index % 2 === 0 && 'bg-accent/30',
        className,
      )}
      data-state={row.getIsSelected() ? 'selected' : undefined}
      data-pinned={pinned ? 'true' : undefined}
      {...props}
    >
      {children}
    </tr>
  )
}

export function TableCell({
  cell,
  children,
  className,
  ...props
}: DataTableCellProps) {
  const align = cell.column.columnDef.meta?.align

  return (
    <td
      className={cn(
        'py-3 px-4',
        align === 'right' && 'text-right tabular-nums',
        align === 'center' && 'text-center',
        className,
      )}
      {...props}
    >
      {children ?? flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  )
}

export function TableHeaderCell({
  header,
  children,
  className,
  ...props
}: DataTableHeaderCellProps) {
  const isSortable = header.column.getCanSort()
  const sorted = header.column.getIsSorted()

  return (
    <th
      className={cn(
        'py-3 px-4 text-left font-semibold text-muted-foreground',
        isSortable && 'cursor-pointer select-none hover:text-foreground',
        className,
      )}
      onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children ?? flexRender(header.column.columnDef.header, header.getContext())}
        {sorted === 'asc' && <ChevronUp className="h-4 w-4" />}
        {sorted === 'desc' && <ChevronDown className="h-4 w-4" />}
      </div>
    </th>
  )
}

// ... other components (Root, Container, Body, etc.)
```

### Priority Order

```
┌─────────────────────────────────────────────────────────────────┐
│                         Priority Order                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   1. Per-instance options     (highest priority)                │
│      └── useDataTable({ components: { Row: MyRow } })           │
│                                                                 │
│   2. Global config            (project-wide defaults)           │
│      └── dataTableConfig.components.Row                         │
│                                                                 │
│   3. Built-in defaults        (shadcn-styled fallbacks)         │
│      └── DefaultRow from library                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Props & Types

### Main Component Types

```typescript
interface DataTableComponents<TData> {
	Root: React.ComponentType<DataTableRootProps>;
	Container: React.ComponentType<DataTableContainerProps>;
	Header: React.ComponentType<DataTableHeaderProps>;
	HeaderRow: React.ComponentType<DataTableHeaderRowProps>;
	HeaderCell: React.ComponentType<DataTableHeaderCellProps>;
	Body: React.ComponentType<DataTableBodyProps>;
	Row: React.ComponentType<DataTableRowProps<TData>>;
	Cell: React.ComponentType<DataTableCellProps<TData>>;
	Footer: React.ComponentType<DataTableFooterProps>;
	PinnedRows: React.ComponentType<DataTablePinnedRowsProps>;
	Toolbar: React.ComponentType<DataTableToolbarProps>;
	Pagination: React.ComponentType<DataTablePaginationProps>;
	Empty: React.ComponentType<DataTableEmptyProps>;
	Loading: React.ComponentType<DataTableLoadingProps>;
	ColumnVisibility: React.ComponentType<DataTableColumnVisibilityProps>;
	Export: React.ComponentType<DataTableExportProps>;
}
```

### Component Props

```typescript
interface DataTableRootProps {
	children: React.ReactNode;
	className?: string;
}

interface DataTableContainerProps {
	children: React.ReactNode;
	className?: string;
	maxHeight?: string;
}

interface DataTableHeaderProps {
	children?: React.ReactNode;
	className?: string;
	sticky?: boolean;
}

interface DataTableHeaderRowProps {
	headerGroup: HeaderGroup<TData>;
	children?: React.ReactNode;
	className?: string;
}

interface DataTableHeaderCellProps {
	header: Header<TData, unknown>;
	children?: React.ReactNode;
	className?: string;
}

interface DataTableBodyProps {
	children?: React.ReactNode;
	className?: string;
}

interface DataTableRowProps<TData> {
	row: Row<TData>;
	children?: React.ReactNode;
	className?: string;
	pinned?: boolean | "top" | "bottom";
}

interface DataTableCellProps<TData> {
	cell: Cell<TData, unknown>;
	children?: React.ReactNode;
	className?: string;
}

interface DataTablePinnedRowsProps {
	position: "top" | "bottom";
	children?: React.ReactNode;
	className?: string;
	sticky?: boolean;
}

interface DataTableToolbarProps {
	children: React.ReactNode;
	className?: string;
}

interface DataTablePaginationProps {
	className?: string;
	showPageSize?: boolean;
	showPageInfo?: boolean;
	pageSizeOptions?: number[];
}

interface DataTableEmptyProps {
	children?: React.ReactNode;
	className?: string;
	message?: string;
}
```

---

## Styling API

### Option 1: Variant-based

```typescript
const { table, Table } = useDataTable({
	data,
	columns,
	variant: "default" | "accent" | "bordered" | "minimal",
});
```

### Option 2: ClassNames Object

```typescript
const { table, Table } = useDataTable({
	data,
	columns,
	classNames: {
		root: "rounded-lg border",
		container: "max-h-[400px] overflow-auto",
		header: "bg-muted sticky top-0 z-10",
		headerRow: "",
		headerCell: "font-semibold px-4 py-3",
		body: "",
		row: "hover:bg-accent border-b",
		rowEven: "bg-accent/50",
		rowOdd: "",
		rowPinned: "bg-info/20 font-bold",
		rowSelected: "bg-primary/10",
		cell: "px-4 py-3",
		footer: "sticky bottom-0 z-10",
		pagination: "border-t px-4 py-2",
		toolbar: "px-4 py-2 border-b",
		empty: "text-center text-muted-foreground py-8",
	},
});
```

### Option 3: Dynamic ClassNames (Functions)

```typescript
const { table, Table } = useDataTable({
	data,
	columns,
	classNames: {
		row: (row) =>
			cn(
				"border-b transition-colors",
				row.getIsPinned() && "bg-info/20 font-bold",
				row.getIsSelected() && "bg-primary/10",
				row.index % 2 === 0 && "bg-accent/30",
			),
		cell: (cell) =>
			cn(
				"px-4 py-3",
				cell.column.columnDef.meta?.align === "right" &&
					"text-right tabular-nums",
			),
	},
});
```

---

## Subcomponents Reference

```typescript
Table.Root; // Outer wrapper
Table.Toolbar; // Top toolbar area
Table.Container; // Scrollable container
Table.Main; // Header + Body + PinnedRows (convenience)
Table.Header; // <thead>
Table.HeaderRow; // <tr> in header
Table.HeaderCell; // <th>
Table.Body; // <tbody>
Table.Row; // <tr>
Table.Cell; // <td>
Table.Footer; // <tfoot>
Table.PinnedRows; // Pinned rows container (top or bottom)
Table.Pagination; // Pagination controls
Table.ColumnVisibility; // Column toggle dropdown
Table.Export; // Export button/dropdown
Table.Empty; // Empty state
Table.Loading; // Loading state
```

---

## File Structure

```
app/components/data-table/
├── index.ts                        # Public exports
├── types.ts                        # TypeScript definitions
├── use-data-table.ts               # Main hook
├── data-table-context.tsx          # Context provider & consumer
├── data-table.tsx                  # Main Table component
├── components/
│   ├── data-table-root.tsx         # Root wrapper
│   ├── data-table-container.tsx    # Scrollable container
│   ├── data-table-main.tsx         # Header + Body + Footer combined
│   ├── data-table-header.tsx       # Header component
│   ├── data-table-header-row.tsx   # Header row
│   ├── data-table-header-cell.tsx  # Header cell with sort UI
│   ├── data-table-body.tsx         # Body component
│   ├── data-table-row.tsx          # Row component
│   ├── data-table-cell.tsx         # Cell component
│   ├── data-table-pinned-rows.tsx  # Pinned rows (top/bottom)
│   ├── data-table-toolbar.tsx      # Toolbar slot
│   ├── data-table-pagination.tsx   # Pagination controls
│   ├── data-table-empty.tsx        # Empty state
│   ├── data-table-loading.tsx      # Loading state
│   ├── data-table-column-visibility.tsx
│   └── data-table-export.tsx
└── utils.ts                        # Helpers
```

---

## Implementation Examples

### Example 1: Simple Table

```typescript
function SimpleTable() {
  const { table, Table } = useDataTable({
    data: users,
    columns: userColumns,
  })

  return <Table />
}
```

### Example 2: With Sorting and Filtering

```typescript
function SortableFilterableTable() {
  const { table, Table } = useDataTable({
    data: users,
    columns: userColumns,
    enableSorting: true,
    enableFiltering: true,
    sorting: {
      initial: [{ id: 'name', desc: false }],
    },
  })

  return (
    <Table
      maxHeight="400px"
      toolbar={
        <input
          placeholder="Search..."
          value={table.getState().globalFilter ?? ''}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
        />
      }
    />
  )
}
```

### Example 3: With Pinned Totals Row

```typescript
function TableWithTotals() {
  const totalsRow = useMemo(() => ({
    id: 'totals',
    date: 'Total',
    amount: data.reduce((sum, row) => sum + row.amount, 0),
    // ...
  }), [data])

  const { table, Table } = useDataTable({
    data,
    columns,
    enablePinning: true,
    pinning: {
      bottom: [totalsRow],
    },
  })

  return <Table maxHeight="350px" stickyFooter />
}
```

### Example 4: Full Composition

```typescript
function FullyCustomTable() {
  const { table, Table } = useDataTable({
    data,
    columns,
    enableSorting: true,
    enablePinning: true,
    enablePagination: true,
  })

  return (
    <Table>
      <Table.Toolbar>
        <DateRangePicker />
        <Spacer />
        <Table.ColumnVisibility />
        <Table.Export formats={['csv', 'xlsx']} />
      </Table.Toolbar>

      <Table.Container maxHeight="400px">
        <Table.Header sticky />
        <Table.Body />
        <Table.PinnedRows position="bottom" sticky />
      </Table.Container>

      <Table.Pagination showPageSize pageSizeOptions={[10, 25, 50, 100]} />
    </Table>
  )
}
```

### Example 5: Project with Global Config

```typescript
// After setting up dataTableConfig and DataTableProvider...

// Every table in the project now uses your custom components
function AnyTable({ data, columns }) {
  const { table, Table } = useDataTable({ data, columns })

  // Automatically uses your custom Row, Cell, etc.
  return <Table />
}
```

---

## Migration Guide

### From Current Implementation

**Before:**

```typescript
function OldTable({ data }) {
  const [sorting, setSorting] = useState([{ id: 'date', desc: true }])
  const [columnFilters, setColumnFilters] = useState([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data</CardTitle>
        <BandFilter column={table.getColumn('band')} />
      </CardHeader>
      <CardContent>
        <div className="max-h-[350px] overflow-auto">
          <table>
            <thead className="sticky top-0 bg-background">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
```

**After:**

```typescript
function NewTable({ data }) {
  const { table, Table } = useDataTable({
    data,
    columns,
    enableSorting: true,
    enableFiltering: true,
    sorting: { initial: [{ id: 'date', desc: true }] },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data</CardTitle>
        <BandFilter column={table.getColumn('band')} />
      </CardHeader>
      <CardContent>
        <Table maxHeight="350px" />
      </CardContent>
    </Card>
  )
}
```

---

## Summary

| Level                       | How                                         | Use Case               |
| --------------------------- | ------------------------------------------- | ---------------------- |
| **Static**                  | `<Table />`                                 | Quick, default styling |
| **Props**                   | `<Table maxHeight="350px" stickyHeader />`  | Minor tweaks           |
| **Slots**                   | `<Table toolbar={<Filter />} />`            | Inject content         |
| **Partial Composition**     | `<Table><Table.Toolbar />...<Table.Main />` | Override some parts    |
| **Full Composition**        | Map over rows manually                      | Complete control       |
| **Per-instance Components** | `components: { Row: X }`                    | One-off custom         |
| **Global Config**           | `dataTableConfig`                           | Project-wide theming   |

---

## Next Steps

1. [ ] Implement `types.ts` - Core type definitions
2. [ ] Implement `data-table-context.tsx` - Context & provider
3. [ ] Implement `use-data-table.ts` - Main hook
4. [ ] Implement default components (shadcn-styled)
5. [ ] Implement `data-table.tsx` - Main component with static/composition detection
6. [ ] Create example custom components file
7. [ ] Test with existing tables (migrate one as POC)
8. [ ] Documentation & examples
