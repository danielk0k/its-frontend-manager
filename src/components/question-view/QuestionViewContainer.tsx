"use client";

import Link from "next/link";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import QuestionViewEditor from "@/components/question-view/QuestionViewEditor";
import QuestionViewFeedback, {
  FeedbackType,
} from "@/components/question-view//QuestionViewFeedback";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getCodeFeedback } from "@/actions/getCodeFeedback";
import { Course, Question, Submission, User } from "@prisma/client";
import { createSubmission } from "@/actions/createSubmission";
import { useRouter } from "next/navigation";
import { PutBlobResult } from "@vercel/blob";

export default function QuestionViewContainer({
  user,
  question,
}: {
  user: User;
  question: Question & { course: Course; submissions: Submission[] };
}) {
  const router = useRouter();
  const [editorContent, setEditorContent] = useState("");
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const handleEditorChange = (value: string | undefined) => {
    setEditorContent(value || "");
  };

  const handleSubmission = async () => {
    try {
      const solFile = new File(
        [editorContent],
        `${user.id}_${question.id}.${question.language}`,
        { type: "text/plain" }
      );
      const response = await fetch(
        `/api/upload/program?filename=${solFile.name}`,
        {
          method: "POST",
          body: solFile,
        }
      );

      const newBlob = (await response.json()) as PutBlobResult;

      const newSubmission = await createSubmission({
        user: user,
        question: question,
        student_solution_url: newBlob.url,
      });

      if (!newSubmission) {
        throw new Error("Unable to create new submission")
      }

      router.push(`/courses/${question.course.code}`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen">
      <ResizablePanel defaultSize={50}>
        <div className="flex flex-col p-6">
          <h2 className="text-lg font-semibold mb-4">{question.title}</h2>
          <p>{question.description}</p>
          <div style={{ marginTop: 14 }}>
            <Link href={`/courses/${question.courseId.substring(8)}`}>
              <Button variant="secondary">Return to course</Button>
            </Link>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex flex-col h-full">
          <QuestionViewEditor
            language={question.language}
            handleEditorChange={handleEditorChange}
          />
          <div className="flex flex-col">
            <QuestionViewFeedback feedbacks={feedbacks} />
            <div className="items-center justify-center p-6">
              <div className="flex mt-4">
                <Button
                  className="mr-2"
                  onClick={async () =>
                    await getCodeFeedback({
                      question: question,
                      student_solution: editorContent,
                    }).then((feedbacks) => setFeedbacks(feedbacks))
                  }
                >
                  Run Check
                </Button>
                <Button onClick={() => handleSubmission()}>Submit Code</Button>
              </div>
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
