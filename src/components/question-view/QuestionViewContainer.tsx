"use client";

import Link from "next/link";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import QuestionViewEditor from "@/components/question-view/QuestionViewEditor";
import QuestionViewFeedback from "@/components/question-view//QuestionViewFeedback";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getCodeFeedback } from "@/actions/getCodeFeedback";
import { Question } from "@prisma/client";


export default function QuestionViewContainer({
  question,
}: {
  question: Question;
}) {
  const [editorContent, setEditorContent] = useState("");
  const handleEditorChange = (value: string | undefined) => {
    setEditorContent(value || "");
  };
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen">
      <ResizablePanel defaultSize={50}>
        <div className="flex flex-col p-6">
          <h2 className="text-lg font-semibold mb-4">{question.title}</h2>
          <p>{question.description}</p>
          <div style={{ marginTop: 14}}>
            <Link href={`/courses/${question.courseId.substring(8)}`}>
              <Button variant="secondary">Return to course</Button>
            </Link>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex flex-col h-full">
            <QuestionViewEditor language={question.language} handleEditorChange={handleEditorChange} />
            <div className="flex flex-col">
              <QuestionViewFeedback />
              <div className="items-center justify-center p-6">
                <div className="flex mt-4">
                  <Button
                    className="mr-2"
                    onClick={async () =>
                      await getCodeFeedback({
                        question: question,
                        student_solution: editorContent,
                      })
                    }
                  >
                    Run Check
                  </Button>
                  <Button>Submit Code</Button>
                </div>
              </div>
            </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
