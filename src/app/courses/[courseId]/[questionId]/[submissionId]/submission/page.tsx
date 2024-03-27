import { redirect } from "next/navigation";
import QuestionViewContainer from "@/components/question-view/QuestionViewContainer";
import { getQuestionInfo } from "@/actions/getQuestionInfo";
import { getUserProps } from "@/actions/getUserProps";
import { Role } from "@prisma/client";
import SubmissionViewContainer from "@/components/submission-view/SubmissionViewContainer";
import { getSubmission } from "@/actions/getSubmission";


export default async function StudentSubmissionView({
  params,
}: {
  params: { questionId: string; courseId: string; submissionId: string };
}) {
  
  const userProps = await getUserProps();
  console.log("submissionid:", params.submissionId);
  const user = userProps.props.user; 

  if (!user) {
    redirect("/");
  }

  const userRole = user.role;
  
  if (!userRole) {
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

  const submission = await getSubmission({submission_id: params.submissionId});

  if (!submission) {
    redirect(`/courses/${params.courseId}`);
  }
  
  
  if (userRole === Role.TEACHER) {
    return <SubmissionViewContainer  submission={submission} question={question} user={user}></SubmissionViewContainer>; 
  } else if (userRole === Role.STUDENT) {
    return <QuestionViewContainer question={question} user={user}></QuestionViewContainer>;
  } else {
    redirect("/"); // Redirect if user role is not defined or recognized
  }

}
