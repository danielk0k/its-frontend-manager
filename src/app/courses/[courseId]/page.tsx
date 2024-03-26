import Link from "next/link";
import QuestionCard from "@/components/question-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserProps } from "@/actions/getUserProps";
import { redirect } from "next/navigation";
import { getCourseInfo } from "@/actions/getCourseInfo";
import NewQuestionDialog from "@/components/dialogs/newQuestion";
import { Question, Role, User } from "@prisma/client";
import AddMemberDialog from "@/components/dialogs/addMember";

export default async function CourseView({
  params,
}: {
  params: { courseId: string };
}) {
  const userProps = await getUserProps();
  const user = userProps.props.user;
  if (!user) {
    redirect("/");
  }

  const course = await getCourseInfo({
    courseId: `${user.school_id}_${params.courseId}`,
  });
  if (!course) {
    redirect("/courses");
  }

  const courseQuestions: Question[] = course.questions;
  const courseMembers: User[] = course.members;
  return (
    <Tabs defaultValue="questions" asChild>
      <section className="grid grid-cols-8 gap-4 p-4">
        <div className="col-span-1 flex flex-col space-y-4">
          <p className="text-lg font-semibold">{params.courseId}</p>
          {user && user.id === course.creator_id && (
            <NewQuestionDialog courseId={course.id} />
            )}
          <TabsList>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            {user.role == Role.TEACHER && (
              <TabsTrigger value="people">People</TabsTrigger>
            )}
          </TabsList>
        </div>
        <div className="col-span-7 border rounded-md p-4">
          <TabsContent value="home">Announcements</TabsContent>
          <TabsContent value="questions" className="grid grid-cols-4 gap-4">
          {courseQuestions.map((question, index) => (
              <Link key={index} href={`/courses/${params.courseId}/${question.id}`}>
                  <QuestionCard
                      question_title={question.title}
                      question_description={question.description}
                  />
              </Link>
              ))}
          </TabsContent>
          {user.role == Role.TEACHER && (
            <TabsContent value="people">
              View your students and teachers here
              <AddMemberDialog user={user} course={course}></AddMemberDialog>
              <ul>
                {courseMembers.map((member, index) => (
                  <li key={index}>{`${member.email} [${member.role}]`}</li>
                ))}
              </ul>
            </TabsContent>
          )}
        </div>
      </section>
    </Tabs>
  );
}
