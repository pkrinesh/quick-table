import { useDataTable } from "@quick-table/react";
import type { ColumnDef } from "@tanstack/react-table";


// Sample data type
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

// Sample data
const users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Viewer", status: "inactive" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Editor", status: "active" },
  { id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "Viewer", status: "active" },
  { id: 6, name: "Diana Miller", email: "diana@example.com", role: "Admin", status: "inactive" },
  { id: 7, name: "Edward Davis", email: "edward@example.com", role: "Editor", status: "active" },
  { id: 8, name: "Fiona Garcia", email: "fiona@example.com", role: "Viewer", status: "active" },
];

// Column definitions
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {status}
        </span>
      );
    },
  },
];

function App() {
  const { Table } = useDataTable({
    data: users,
    columns,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-4">quick-table Playground</h1>
        <p className="text-muted-foreground mb-6">
          TanStack Table wrapper that makes tables easy to build.
        </p>
          <Table />
      </div>
    </div>
  );
}

export default App;
