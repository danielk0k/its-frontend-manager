"use client";

import { Users, columns } from "@/components/user-management/columns";
import { DataTable } from "@/components/user-management/data-table";

export default function DataTableContainer({
  name,
  users,
}: {
  name: string;
  users: Users[];
}) {
  return (
    <div className="container mx-auto py-10">
      <DataTable institution={name} columns={columns} data={users} />
    </div>
  );
}
