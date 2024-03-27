"use client";

import { UserSubmission } from "@/actions/getQuestionSubmissions";
import { columns } from "@/components/grading/columns";
import { DataTable } from "@/components/grading/data-table";

export default function DataTableContainer({
  users,
}: {
  users: UserSubmission[];
}) {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={users} />
    </div>
  );
}
