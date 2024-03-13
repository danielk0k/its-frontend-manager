import { redirect } from "next/navigation";
import QuestionViewContainer from "@/components/question-view/QuestionViewContainer";

export default async function QuestionView({
  params,
}: {
  params: { questionId: string };
}) {
  // Check if question exist and fetch question content
  // const response = await fetch("YOUR_API_ENDPOINT");
  const response = { ok: true };
  if (response.ok) {
    // const question = await response.json();
    const question = {
      id: "",
      title: "Hello World Challenge",
      description: "Print \"Hello World\" in Python using only binary bits",
      entry_function: "",
      io_input: "",
      func_args: "",
      reference_program_id: "",
      courseId: "CS1010",
    };
    return <QuestionViewContainer question={question}></QuestionViewContainer>;
  } else {
    redirect("/courses");
  }
}
