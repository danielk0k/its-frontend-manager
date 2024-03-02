'use client';
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import uploadFileImage from "./uploadfile.png";


interface AssignmentPageProps {
  questionCount: number;
  courseId: string;
  assignmentId: string;
  assignmentDescription: string; // Define assignmentDescription prop
}

export default function AssignmentView({questionCount, courseId, assignmentId, assignmentDescription}: AssignmentPageProps) {
  const [editorContent, setEditorContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleEditorChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorContent(event.target.value);
  };
    
  const questionNumbers = Array.from(Array(questionCount).keys()).map(
    (index) => index + 1
  );

  //handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Safely access the first file
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('YOUR_UPLOAD_ENDPOINT', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                // File uploaded successfully
                console.log('File uploaded successfully');
            } else {
                // Handle error uploading file
                console.error('Error uploading file:', response.statusText);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }
};

  return (
    <div className="grid grid-cols-8 gap-4 p-4">
        <div className="col-span-1 flex flex-col space-y-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Assignment</h2>
          </div>
          <div className="flex flex-wrap">
            {/* Render buttons for each question */}
            {questionNumbers.map((questionNumber) => (
            <Button 
              key={questionNumber} 
              className="mr-2"
            >
              Question {questionNumber}
            </Button>
            ))}
          </div>
          <div className="absolute bottom-4 left-4">
            <Button onClick={() => window.history.back()}>
                Back
            </Button>
          </div>
        </div>

        {/*for panels*/}
        <div className="col-span-7 border rounded-md p-0" style={{height: '100%'}}>
          
          <ResizablePanelGroup
                direction="horizontal"
                className="max-w-screen-x2 mx-auto rounded-lg border w-full"
                style={{ marginTop: '20px', marginRight: '20px', height: '100vh'}}
            >
                <ResizablePanel defaultSize={50}>
                    <div className="flex flex-col h-full p-6">
                        <h2 className="text-lg font-semibold mb-4">Assignment Description</h2>
                        <p>{assignmentDescription}</p>
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={50}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={85}>
                            <div className="flex h-full items-center justify-center p-6">
                                <textarea
                                    value={editorContent}
                                    onChange={handleEditorChange}
                                    className="w-full h-full border p-2"
                                    placeholder="Enter your code here..."
                                />
                            </div>
                        </ResizablePanel>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={15}>
                            <div className="flex h-full items-center justify-center p-6">
                                <div className="flex mt-4">
                                  <label htmlFor="file-upload">
                                    <img
                                        src={uploadFileImage.src}
                                        alt="Upload"
                                        style={{ width: 'auto', height: '40px' }} // Adjust image size here
                                        className="cursor-pointer mr-2"
                                    />
                                  </label>
                                  <input
                                        id="file-upload"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={handleFileUpload}
                                  />
                                  <Button className="mr-2">Run Code</Button>
                                  <Button>Submit</Button>
                                </div>
                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
            
        </div>

    </div>
      

  );
}
