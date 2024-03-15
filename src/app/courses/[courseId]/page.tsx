import AssignmentCard from "@/components/assignment-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import { getUserProps } from "@/actions/getUserProps";
import NewQuestionDialog from "@/components/dialogs/newQuestion";
import { Question } from "@prisma/client";


export default async function CourseView({
  params,
}: {
  params: { courseId: string };
}) 
{
  const user = await getUserProps();
  
  if (!user.props.user) {
    redirect("/");
  }

  let questions: Question[] = [];

  //TODO: Implement API to fetch All questions
  
  return (
    <Tabs defaultValue="assignments" asChild>
      <section className="grid grid-cols-8 gap-4 p-4">
        <div className="col-span-1 flex flex-col space-y-4">
          <p className="text-lg font-semibold">{params.courseId}</p>
          <NewQuestionDialog user={user.props.user} course_name={params.courseId}/>
          <TabsList>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
          </TabsList>
        </div>
        <div className="col-span-7 border rounded-md p-4">
          <TabsContent value="home">Announcements</TabsContent>
          <TabsContent value="assignments" className="grid grid-cols-4 gap-4">
            {questions.map((question, index) => (
                <AssignmentCard
                  key={index}
                  question_title={question.title}
                  question_description={question.description}
                />
              ))}
          </TabsContent>
          <TabsContent value="people">
            View your students and teachers here
          </TabsContent>
        </div>
      </section>
    </Tabs>
  );
}
