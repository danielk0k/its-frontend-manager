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

import { Question } from "@prisma/client";

const parserApiUrl = "https://its.comp.nus.edu.sg/cs3213/parser";
const feedbackFixApiUrl = "https://its.comp.nus.edu.sg/cs3213/feedback_fix";
const language_map = {
  py: "python",
  c: "c",
};

export async function getCodeFeedback({
  question,
  student_solution,
}: {
  question: Question;
  student_solution: string;
}) {
  try {
    const { reference_program, language } = question;
    const reference_program_text = await fetch(reference_program).then((res) =>
      res.text()
    );

    // Generates parsed student code and reference code
    const parsedStudentCode = await parseCode({
      language: language_map[language],
      source_code: student_solution,
    });
    const parsedReferenceCode = await parseCode({
      language: language_map[language],
      source_code: reference_program_text,
    });

    // Generate feedback
    const feedback = await generateFeedback({
      language: question.language,
      reference_solution: JSON.stringify(parsedReferenceCode),
      student_solution: JSON.stringify(parsedStudentCode),
      function: question.entry_function,
      inputs: question.io_input,
      args: question.func_args,
    });

    return feedback;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Call the parser API
async function parseCode(sourceCodeParams) {
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
async function generateFeedback(req): Promise<any> {
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
