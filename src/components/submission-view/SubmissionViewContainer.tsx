'use client';

import Link from "next/link";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Question, Submission, User } from "@prisma/client";
import SubmissionViewEditor from "./SubmissionViewEditor";
import { setSubmissionGrade } from "@/actions/setSubmissionGrade";
import QuestionViewFeedback, { FeedbackType } from "../question-view/QuestionViewFeedback";


export default function SubmissionViewContainer({
  submission,
  question,
  user,
}: {
  submission: Submission,
  question: Question;
  user: User;
}) {

 
  const [feedback, setFeedback] = useState<FeedbackType[]>([]);

  const handleSave = () => {
    window.location.reload();
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
          <div style={{ marginTop: 14}}>
            <Link href={`/courses/${question.courseId.substring(8)}/${question.id}/gradingdashboard`}>
              <Button variant="secondary">Return to grading dashboard</Button>
            </Link>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex flex-col h-full">     
            <SubmissionViewEditor code={submission.submitted_program} language={question.language} />
            <div className="flex flex-col">
              <QuestionViewFeedback feedbacks={feedback} />
              {/* <SubmissionViewFeedback feedback={submission.feedback || ""}/>     */}
              <div className="items-center justify-center p-6">
                <div className="flex mt-4">    
                  <div>
                    <input
                      type="number"
                      onChange={(e) => setSubmissionGrade({submission_id : submission.id, grade: parseInt(e.target.value)})}
                      className="border rounded-md px-2 py-1"
                      placeholder="Score"
                    />
                    
                    {/* <input
                      className="flex-grow border rounded-md px-2 py-1 w-full"
                      placeholder="Comments"
                      style={{ resize: "vertical" }}
                    /> */}
                   
                  </div>
                  <div className="flex-grow ml-8">
                    <Button onClick={handleSave}>Submit</Button>
                  </div>
                  
                </div>
              </div>
              
            </div>
            
        </div>
        
      </ResizablePanel>
      
    </ResizablePanelGroup>
  );
}
