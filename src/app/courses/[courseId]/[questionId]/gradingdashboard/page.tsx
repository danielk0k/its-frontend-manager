import DataTableContainer from "@/components/grading/DataTableContainer";
import { getQuestionSubmissions } from "@/actions/getQuestionSubmissions";
import { redirect } from "next/navigation";

export default async function GradingDashboardView({
  params,
}: {
  params: { questionId: string; courseId: string };
}) {
  const question = { question_id: params.questionId};
  
  const submissions = await getQuestionSubmissions(question);
  if (!submissions) {
    redirect(`/courses/${params.courseId}`);
  }
  
  
  return (
    <div>
      <main className="flex min-h-screen flex-col">
        <div className="z-10 max-w-5xl w-full justify-start font-mono text-sm lg:flex">
          <div className="absolute left-5 top-18"></div>
        </div>
        <DataTableContainer users={submissions}></DataTableContainer>
      </main>
    </div>
  );
}
