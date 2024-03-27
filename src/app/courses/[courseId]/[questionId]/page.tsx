import { redirect } from "next/navigation";
import QuestionViewContainer from "@/components/question-view/QuestionViewContainer";
import { getQuestionInfo } from "@/actions/getQuestionInfo";
import { getUserProps } from "@/actions/getUserProps";

export default async function QuestionView({
  params,
}: {
  params: { questionId: string; courseId: string };
}) {
  const userProps = await getUserProps();
  const user = userProps.props.user;
  if (!user) {
    redirect("/");
  }

  const question = await getQuestionInfo({
    questionId: params.questionId,
    courseId: params.courseId.toUpperCase(),
    schoolId: user.school_id,
  });

  if (!question) {
    redirect(`/courses/${params.courseId}`);
  }
  
  return <QuestionViewContainer question={question} user={user}></QuestionViewContainer>;  
}
