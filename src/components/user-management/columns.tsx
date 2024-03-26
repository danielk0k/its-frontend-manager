import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@prisma/client";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "select",
    header: "Select",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "index",
    header: "Index",
    cell: ({ row }) => <span>{row.index + 1}</span>,
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
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const email = row.original.email; // Extracting email from the row data
      return <ActionDropdown email={email || ""} />;
    },
  },
];

// Define a separate component for the dropdown menu
const ActionDropdown: React.FC<{ email: string }> = ({ email }) => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [error, setError] = React.useState<string | null>(null); 

  const promoteToTeacher = async () => {
    try {
      const response = await fetch("/api/user-management/promote-to-teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        console.log("User promoted to teacher successfully");
        // Update the user's role in the local state
        window.location.reload();
      } else {
        console.error("Failed to promote user to teacher");
        setError("Failed to promote user to teacher");
      }
    } catch (error) {
      console.error("Error promoting user to teacher:", error);
      setError("Error promoting user to teacher. Please try again later.");
    }
  };

  const deleteUser = async () => {
    try {
      const response = await fetch("/api/user-management/delete-row", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        console.log("User deleted successfully");
        window.location.reload();
      } else {
        console.error("Failed to delete user");
        setError("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Error deleting user. Please try again later.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={promoteToTeacher}>
          Promote
        </DropdownMenuItem>
        <DropdownMenuItem onClick={deleteUser}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
