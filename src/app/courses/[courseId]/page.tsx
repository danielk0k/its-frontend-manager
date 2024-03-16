import Link from "next/link";
import QuestionCard from "@/components/question-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserProps } from "@/actions/getUserProps";
import { redirect } from "next/navigation";
import { getCourseInfo } from "@/actions/getCourseInfo";
import NewQuestionDialog from "@/components/dialogs/newQuestion";

interface Question {
    title: string,
    description: string,
    id: string
}

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

    const course = await getCourseInfo({courseId: `${user.school_id}_${params.courseId}`});
    if (!course) {
      redirect("/courses")
    }


    // Get course questions, display on cards
    const courseQuestions: Question[] = course.questions;

    return (
        <Tabs defaultValue="questions" asChild>
        <section className="grid grid-cols-8 gap-4 p-4">
            <div className="col-span-1 flex flex-col space-y-4">
            <p className="text-lg font-semibold">{params.courseId}</p>
            {/*Conditional rendering of "create new question" based on whether user is the creator of the course*/}
            {user && user.id === course.creator_id && (
            <NewQuestionDialog user={user} course_name={params.courseId} />
            )}
            <TabsList>
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="people">People</TabsTrigger>
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
            <TabsContent value="people">
                View your students and teachers here
            </TabsContent>
            </div>
        </section>
        </Tabs>
    );
}
