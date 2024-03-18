"use server";

/*
Request for this API should be of the following form. This is consistent with the request format of the Feedback Service ITS API
- language: python | c | py
- reference_solution: string (program)
- student_solution: string (program)
- function: string (the entry function of the program)
- inputs: IO inputs
- args: arguments of the entry function (for e.g. "[2]") (string wrapped in '[]')

Example Usage:

const ref_program = `def main():
    a = 10
    b = 0
    for i in range(0, a):
        b = b + 1
    return b`

const student_program = `def main():
    a = 10
    b = 0
    for i in range(0, a):
        b = b - 1
    return b`

**Note that the function declaration must not start with a newline and the indentation of the code is consistent with python indentation.**

const requestData = {
    language: 'python',
    reference_solution: ref_program,
    student_solution: student_program,
    function: "main",
    inputs: "[]",
    args: "",
};

const feedback = await fetch(process.env.URL + '/api/get-feedback', {
    method: 'POST',
    body: JSON.stringify(requestData),
});

*/

import { NextResponse } from "next/server";
import { Question } from "@prisma/client";

const parserApiUrl = "https://its.comp.nus.edu.sg/cs3213/parser";
const feedbackFixApiUrl = "https://its.comp.nus.edu.sg/cs3213/feedback_fix";

export async function getCodeFeedback({
  question,
  student_solution,
}: {
  question: Question;
  student_solution: string;
}) {
  try {
    const { reference_program, entry_function, io_input, func_args } =
      question;

    // TODO: language is set to python for now
    const unparsedStudentSolution = {
      language: "python",
      source_code: student_solution,
    };

    const unparsedReferenceSolution = {
      language: "python",
      source_code: await fetch(reference_program).then((res) => res.text()),
    };

    // Generates parsed student code and reference code
    const parsedStudentCode = await parseCode(unparsedStudentSolution);
    const parsedReferenceCode = await parseCode(unparsedReferenceSolution);
    const requestData = {
      language: "py", // not "python" unlike the parser
      reference_solution: JSON.stringify(parsedReferenceCode),
      student_solution: JSON.stringify(parsedStudentCode),
      function: entry_function,
      inputs: io_input,
      args: func_args,
    };

    // Generate feedback
    const feedback = await generateFeedback(requestData);
    return NextResponse.json({ body: feedback });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Call the parser API
async function parseCode(sourceCodeParams: any) {
  try {
    const response = await fetch(parserApiUrl, {
      method: "POST",
      body: JSON.stringify(sourceCodeParams),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error parsing source code:", error);
    throw error;
  }
}

// Call the Feedback service API
async function generateFeedback(req: any): Promise<any> {
  try {
    const feedback = await fetch(feedbackFixApiUrl, {
      method: "POST",
      body: JSON.stringify(req),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!feedback.ok) {
      throw new Error("Network response was not ok");
    }
    return feedback.json();
  } catch (error) {
    console.error("Error generating feedback:", error);
    throw error;
  }
}
