import { redirect } from "next/navigation";
import QuestionViewContainer from "@/components/question-view/QuestionViewContainer";
import { getQuestionInfo } from "@/actions/getQuestionInfo";

export default async function QuestionView({
  params,
}: {
  params: { questionId: string; courseId: string };
}) {
  const question = await getQuestionInfo({
    questionId: params.questionId,
    courseId: params.courseId.toUpperCase(),
  });

  if (!question) {
    redirect(`/courses/${params.courseId}`);
  }

  return <QuestionViewContainer question={question}></QuestionViewContainer>;
}
