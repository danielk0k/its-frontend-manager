import React from "react";

export default function QuestionViewEditor({
  handleEditorChange,
}: {
  handleEditorChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <textarea
        onChange={handleEditorChange}
        className="w-full h-full border p-2"
        placeholder="Enter your code here..."
      />
    </div>
  );
}
