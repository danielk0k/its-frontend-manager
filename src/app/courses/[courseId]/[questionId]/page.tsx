import { redirect } from "next/navigation";
import QuestionViewContainer from "@/components/question-view/QuestionViewContainer";
import { getQuestionInfo } from "@/actions/getQuestionInfo";
import { getUserProps } from "@/actions/getUserProps";

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

  const user = await getUserProps();
  if (!user.props.user) {
    redirect("/");
  }

  return <QuestionViewContainer question={question} user={user.props.user}></QuestionViewContainer>;
}
